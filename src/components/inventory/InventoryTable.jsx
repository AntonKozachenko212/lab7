import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { inventoryApi } from "../../services/inventoryApi";
import ConfirmModal from "./ConfirmModal";

export default function InventoryTable({ items, onDeleted }) {
  const navigate = useNavigate();
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  async function handleDelete() {
    setDeleteLoading(true);
    try {
      await inventoryApi.delete(deleteTarget.id);
      onDeleted(deleteTarget.id);
      setDeleteTarget(null);
    } catch (e) {
      alert(`Delete failed: ${e.message}`);
    } finally {
      setDeleteLoading(false);
    }
  }

  return (
    <>
      <div className="overflow-x-auto rounded-lg border border-zinc-800">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-zinc-900 border-b border-zinc-800">
              <th className="text-left px-4 py-3 text-zinc-500 uppercase tracking-widest text-xs font-normal w-16">
                Photo
              </th>
              <th className="text-left px-4 py-3 text-zinc-500 uppercase tracking-widest text-xs font-normal">
                Name
              </th>
              <th className="text-left px-4 py-3 text-zinc-500 uppercase tracking-widest text-xs font-normal hidden md:table-cell">
                Description
              </th>
              <th className="text-right px-4 py-3 text-zinc-500 uppercase tracking-widest text-xs font-normal">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, i) => (
              <tr
                key={item.id}
                className={`border-b border-zinc-800/60 hover:bg-zinc-900/60 transition-colors ${
                  i % 2 === 0 ? "bg-zinc-950" : "bg-zinc-900/20"
                }`}
              >
                {/* Photo */}
                <td className="px-4 py-3">
                  <div className="w-10 h-10 rounded overflow-hidden bg-zinc-800 border border-zinc-700">
                    <img
                      src={inventoryApi.photoUrl(item.id)}
                      alt={item.inventory_name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = "none";
                        e.target.parentNode.innerHTML =
                          '<div class="w-full h-full flex items-center justify-center text-zinc-600 text-lg">▦</div>';
                      }}
                    />
                  </div>
                </td>

                {/* Name */}
                <td className="px-4 py-3">
                  <span className="text-zinc-100 font-medium">{item.inventory_name}</span>
                </td>

                {/* Description */}
                <td className="px-4 py-3 hidden md:table-cell">
                  <span className="text-zinc-400 line-clamp-2 max-w-xs">
                    {item.description || <em className="text-zinc-600">—</em>}
                  </span>
                </td>

                {/* Actions */}
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => navigate(`/inventory/${item.id}`)}
                      className="px-3 py-1.5 text-xs uppercase tracking-wider text-zinc-400 hover:text-zinc-100 border border-zinc-700 hover:border-zinc-500 rounded transition-colors"
                    >
                      View
                    </button>
                    <button
                      onClick={() => navigate(`/inventory/${item.id}/edit`)}
                      className="px-3 py-1.5 text-xs uppercase tracking-wider text-amber-400 hover:text-amber-300 border border-amber-900/50 hover:border-amber-600/50 rounded transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => setDeleteTarget(item)}
                      className="px-3 py-1.5 text-xs uppercase tracking-wider text-red-500 hover:text-red-400 border border-red-900/40 hover:border-red-700/50 rounded transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {deleteTarget && (
        <ConfirmModal
          message={`Delete "${deleteTarget.inventory_name}"? This cannot be undone.`}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
          loading={deleteLoading}
        />
      )}
    </>
  );
}
