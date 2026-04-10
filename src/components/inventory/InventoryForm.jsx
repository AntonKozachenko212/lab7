import { useState } from "react";

export default function InventoryForm({ initial = {}, onSubmit, loading, submitLabel = "Save" }) {
  const [name, setName] = useState(initial.inventory_name || "");
  const [desc, setDesc] = useState(initial.description || "");
  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState(null);
  const [errors, setErrors] = useState({});

  function validate() {
    const e = {};
    if (!name.trim()) e.name = "Name is required";
    return e;
  }

  function handlePhotoChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    setPhoto(file);
    setPreview(URL.createObjectURL(file));
  }

  function handleSubmit(e) {
    e.preventDefault();
    const e2 = validate();
    if (Object.keys(e2).length) {
      setErrors(e2);
      return;
    }
    setErrors({});
    onSubmit({ name: name.trim(), description: desc.trim(), photo });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-lg">
      {/* Name */}
      <div>
        <label className="block text-xs uppercase tracking-widest text-zinc-500 mb-2">
          Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter inventory name"
          className={`w-full bg-zinc-900 border rounded px-4 py-3 text-zinc-100 placeholder-zinc-600 text-sm focus:outline-none focus:border-amber-500 transition-colors ${
            errors.name ? "border-red-500" : "border-zinc-700"
          }`}
        />
        {errors.name && (
          <p className="mt-1 text-xs text-red-400">{errors.name}</p>
        )}
      </div>

      {/* Description */}
      <div>
        <label className="block text-xs uppercase tracking-widest text-zinc-500 mb-2">
          Description
        </label>
        <textarea
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          rows={4}
          placeholder="Optional description..."
          className="w-full bg-zinc-900 border border-zinc-700 rounded px-4 py-3 text-zinc-100 placeholder-zinc-600 text-sm focus:outline-none focus:border-amber-500 transition-colors resize-none"
        />
      </div>

      {/* Photo */}
      <div>
        <label className="block text-xs uppercase tracking-widest text-zinc-500 mb-2">
          Photo
        </label>
        <div className="flex items-start gap-4">
          {preview && (
            <div className="w-20 h-20 rounded border border-zinc-700 overflow-hidden shrink-0">
              <img src={preview} alt="preview" className="w-full h-full object-cover" />
            </div>
          )}
          <label className="flex-1 flex flex-col items-center justify-center border border-dashed border-zinc-700 hover:border-amber-500/50 rounded px-4 py-6 cursor-pointer transition-colors group">
            <span className="text-2xl text-zinc-600 group-hover:text-amber-500/60 transition-colors mb-2">
              ↑
            </span>
            <span className="text-xs text-zinc-500 group-hover:text-zinc-400 transition-colors">
              {photo ? photo.name : "Click to upload image"}
            </span>
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs uppercase tracking-widest font-bold rounded transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {loading && (
          <span className="inline-block w-3 h-3 border border-zinc-800/40 border-t-zinc-800 rounded-full animate-spin" />
        )}
        {submitLabel}
      </button>
    </form>
  );
}
