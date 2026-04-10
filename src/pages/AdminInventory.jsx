import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useInventory } from "../store/InventoryContext";
import InventoryTable from "../components/inventory/InventoryTable";

function SkeletonRow() {
  return (
    <tr className="border-b border-zinc-800/60">
      {[...Array(4)].map((_, i) => (
        <td key={i} className="px-4 py-3">
          <div className="h-4 bg-zinc-800 rounded animate-pulse" />
        </td>
      ))}
    </tr>
  );
}

export default function AdminInventory() {
  const { items, loading, error, fetchAll, removeItem } = useInventory();
  const navigate = useNavigate();

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-zinc-100 tracking-tight">Inventory</h1>
          <p className="text-zinc-500 text-sm mt-1">
            {loading ? "Loading..." : `${items.length} item${items.length !== 1 ? "s" : ""}`}
          </p>
        </div>
        <button
          onClick={() => navigate("/inventory/create")}
          className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs uppercase tracking-widest font-bold rounded transition-colors"
        >
          + Add Item
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 px-4 py-3 rounded border border-red-800 bg-red-950/30 text-red-400 text-sm">
          ⚠ Failed to load: {error}
        </div>
      )}

      {/* Loading skeleton */}
      {loading && (
        <div className="rounded-lg border border-zinc-800 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-zinc-900 border-b border-zinc-800">
                {["Photo", "Name", "Description", "Actions"].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-zinc-500 text-xs uppercase tracking-widest font-normal">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[...Array(5)].map((_, i) => <SkeletonRow key={i} />)}
            </tbody>
          </table>
        </div>
      )}

      {/* Empty */}
      {!loading && !error && items.length === 0 && (
        <div className="rounded-lg border border-dashed border-zinc-800 py-20 text-center">
          <div className="text-5xl text-zinc-700 mb-4">▦</div>
          <p className="text-zinc-500 text-sm">No inventory items yet.</p>
          <button
            onClick={() => navigate("/inventory/create")}
            className="mt-4 text-amber-400 hover:text-amber-300 text-xs uppercase tracking-wider transition-colors"
          >
            Create first item →
          </button>
        </div>
      )}

      {/* Table */}
      {!loading && items.length > 0 && (
        <InventoryTable items={items} onDeleted={removeItem} />
      )}
    </div>
  );
}
