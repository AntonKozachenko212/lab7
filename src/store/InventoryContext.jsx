import { createContext, useContext, useState, useCallback } from "react";
import { inventoryApi } from "../services/inventoryApi";

const InventoryContext = createContext(null);

export function InventoryProvider({ children }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await inventoryApi.getAll();
      setItems(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const removeItem = (id) => setItems((prev) => prev.filter((i) => i.id !== id));

  return (
    <InventoryContext.Provider value={{ items, loading, error, fetchAll, removeItem }}>
      {children}
    </InventoryContext.Provider>
  );
}

export function useInventory() {
  const ctx = useContext(InventoryContext);
  if (!ctx) throw new Error("useInventory must be inside InventoryProvider");
  return ctx;
}
