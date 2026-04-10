import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import AdminInventory from "./pages/AdminInventory";
import AdminInventoryCreate from "./pages/AdminInventoryCreate";
import AdminInventoryEdit from "./pages/AdminInventoryEdit";
import AdminInventoryDetails from "./pages/AdminInventoryDetails";

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-zinc-950 text-zinc-100 font-mono">
        {/* Navbar */}
        <nav className="border-b border-zinc-800 bg-zinc-900/80 backdrop-blur-sm sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-6 h-14 flex items-center gap-6">
            <span className="text-amber-400 font-bold tracking-widest uppercase text-sm">
              ▦ Warehouse
            </span>
            <NavLink
              to="/"
              className={({ isActive }) =>
                `text-xs uppercase tracking-wider transition-colors ${
                  isActive ? "text-amber-400" : "text-zinc-400 hover:text-zinc-100"
                }`
              }
            >
              Inventory
            </NavLink>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto px-6 py-10">
          <Routes>
            <Route path="/" element={<AdminInventory />} />
            <Route path="/inventory/create" element={<AdminInventoryCreate />} />
            <Route path="/inventory/:id/edit" element={<AdminInventoryEdit />} />
            <Route path="/inventory/:id" element={<AdminInventoryDetails />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
