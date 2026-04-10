import express from "express";
import multer from "multer";
import cors from "cors";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = 3000;

// Storage for uploaded photos
const UPLOADS_DIR = path.join(__dirname, "uploads");
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR);

// In-memory DB
let items = [
  { id: "1", inventory_name: "Laptop Dell XPS", description: "15-inch developer laptop" },
  { id: "2", inventory_name: "Mechanical Keyboard", description: "Cherry MX Blue switches" },
  { id: "3", inventory_name: "USB-C Hub", description: "7-in-1 multiport adapter" },
];
let nextId = 4;

const upload = multer({ dest: UPLOADS_DIR });

app.use(cors());
app.use(express.json());

// GET /inventory
app.get("/inventory", (req, res) => {
  res.json(items);
});

// GET /inventory/:id
app.get("/inventory/:id", (req, res) => {
  const item = items.find((i) => i.id === req.params.id);
  if (!item) return res.status(404).json({ error: "Not found" });
  res.json(item);
});

// GET /inventory/:id/photo
app.get("/inventory/:id/photo", (req, res) => {
  const photoPath = path.join(UPLOADS_DIR, `${req.params.id}`);
  if (fs.existsSync(photoPath)) {
    res.sendFile(photoPath);
  } else {
    // Return a placeholder SVG if no photo
    res.setHeader("Content-Type", "image/svg+xml");
    res.send(`<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
      <rect width="200" height="200" fill="#27272a"/>
      <text x="100" y="110" text-anchor="middle" font-size="60" fill="#52525b">▦</text>
    </svg>`);
  }
});

// POST /register  (create)
app.post("/register", upload.single("photo"), (req, res) => {
  const { inventory_name, description } = req.body;
  if (!inventory_name) return res.status(400).json({ error: "inventory_name is required" });

  const id = String(nextId++);
  const item = { id, inventory_name, description: description || "" };
  items.push(item);

  // Save photo if provided
  if (req.file) {
    fs.renameSync(req.file.path, path.join(UPLOADS_DIR, id));
  }

  res.status(201).json(item);
});

// PUT /inventory/:id  (update text)
app.put("/inventory/:id", (req, res) => {
  const idx = items.findIndex((i) => i.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "Not found" });

  const { inventory_name, description } = req.body;
  if (inventory_name) items[idx].inventory_name = inventory_name;
  if (description !== undefined) items[idx].description = description;

  res.json(items[idx]);
});

// PUT /inventory/:id/photo  (update photo)
app.put("/inventory/:id/photo", upload.single("photo"), (req, res) => {
  const item = items.find((i) => i.id === req.params.id);
  if (!item) return res.status(404).json({ error: "Not found" });

  if (req.file) {
    fs.renameSync(req.file.path, path.join(UPLOADS_DIR, req.params.id));
  }

  res.json({ ok: true });
});

// DELETE /inventory/:id
app.delete("/inventory/:id", (req, res) => {
  const idx = items.findIndex((i) => i.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "Not found" });

  items.splice(idx, 1);

  const photoPath = path.join(UPLOADS_DIR, req.params.id);
  if (fs.existsSync(photoPath)) fs.unlinkSync(photoPath);

  res.json({ ok: true });
});

app.listen(PORT, () => {
  console.log(`Mock API running at http://localhost:${PORT}`);
});
