import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { inventoryApi } from "../services/inventoryApi";
import InventoryDetails from "../components/inventory/InventoryDetails";

export default function AdminInventoryDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    inventoryApi
      .getById(id)
      .then(setItem)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="text-zinc-500 hover:text-zinc-100 transition-colors text-sm"
          >
            ← Back
          </button>
          <span className="text-zinc-700">/</span>
          <h1 className="text-xl font-bold text-zinc-100">
            {loading ? "Loading..." : item?.inventory_name}
          </h1>
        </div>
        {item && (
          <button
            onClick={() => navigate(`/inventory/${id}/edit`)}
            className="px-4 py-2 text-xs uppercase tracking-wider text-amber-400 border border-amber-900/50 hover:border-amber-600/50 rounded transition-colors"
          >
            Edit
          </button>
        )}
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center gap-3 text-zinc-500 text-sm py-10">
          <span className="inline-block w-4 h-4 border border-zinc-600 border-t-zinc-400 rounded-full animate-spin" />
          Loading item...
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="px-4 py-3 rounded border border-red-800 bg-red-950/30 text-red-400 text-sm">
          ⚠ {error}
        </div>
      )}

      {/* Content */}
      {item && <InventoryDetails item={item} />}
    </div>
  );
}
