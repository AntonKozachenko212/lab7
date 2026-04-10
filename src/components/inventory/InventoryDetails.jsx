import { inventoryApi } from "../../services/inventoryApi";

export default function InventoryDetails({ item }) {
  return (
    <div className="flex flex-col md:flex-row gap-8">
      {/* Image */}
      <div className="w-full md:w-72 shrink-0">
        <div className="aspect-square rounded-lg overflow-hidden bg-zinc-900 border border-zinc-800">
          <img
            src={inventoryApi.photoUrl(item.id)}
            alt={item.inventory_name}
            width="200px"
            height="200px"
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.style.display = "none";
              e.target.parentNode.innerHTML =
                '<div class="w-full h-full flex items-center justify-center text-zinc-700 text-5xl">▦</div>';
            }}
          />
        </div>
      </div>

      {/* Info */}
      <div className="flex-1 space-y-6">
        <div>
          <p className="text-xs uppercase tracking-widest text-zinc-500 mb-1">Item name</p>
          <h2 className="text-2xl font-bold text-zinc-100">{item.inventory_name}</h2>
        </div>

        {item.description && (
          <div>
            <p className="text-xs uppercase tracking-widest text-zinc-500 mb-1">Description</p>
            <p className="text-zinc-300 text-sm leading-relaxed">{item.description}</p>
          </div>
        )}

        <div>
          <p className="text-xs uppercase tracking-widest text-zinc-500 mb-1">ID</p>
          <p className="text-zinc-500 font-mono text-xs">{item.id}</p>
        </div>
      </div>
    </div>
  );
}
