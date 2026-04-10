import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { inventoryApi } from "../services/inventoryApi";
import InventoryForm from "../components/inventory/InventoryForm";

export default function AdminInventoryCreate() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit({ name, description, photo }) {
    setLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("inventory_name", name);
      formData.append("description", description);
      if (photo) formData.append("photo", photo);

      await inventoryApi.create(formData);
      navigate("/");
    } catch (e) {
      setError(e.message);
      setLoading(false);
    }
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <button
          onClick={() => navigate(-1)}
          className="text-zinc-500 hover:text-zinc-100 transition-colors text-sm"
        >
          ← Back
        </button>
        <span className="text-zinc-700">/</span>
        <h1 className="text-xl font-bold text-zinc-100">New Item</h1>
      </div>

      {error && (
        <div className="mb-6 px-4 py-3 rounded border border-red-800 bg-red-950/30 text-red-400 text-sm max-w-lg">
          ⚠ {error}
        </div>
      )}

      <InventoryForm
        onSubmit={handleSubmit}
        loading={loading}
        submitLabel="Create Item"
      />
    </div>
  );
}
