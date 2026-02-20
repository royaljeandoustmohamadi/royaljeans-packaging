import { create } from 'zustand';
import inventoryService from '../services/inventory.service';

const useInventoryStore = create((set) => ({
  materialStock: [],
  productStock: [],
  lowStockItems: [],
  warehouses: [],
  loading: false,
  error: null,

  fetchMaterialStock: async () => {
    set({ loading: true });
    try {
      const data = await inventoryService.getMaterialStockLevels();
      set({ materialStock: data.materials || [], loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },

  fetchLowStock: async () => {
    try {
      const data = await inventoryService.getLowStock();
      set({ lowStockItems: data.items || [] });
    } catch (err) {
      set({ error: err.message });
    }
  },

  fetchWarehouses: async () => {
    try {
      const data = await inventoryService.getWarehouses();
      set({ warehouses: data.warehouses || [] });
    } catch (err) {
      set({ error: err.message });
    }
  },

  recordMaterialIn: async (data) => {
    try {
      const res = await inventoryService.materialIn(data);
      return res;
    } catch (err) {
      set({ error: err.message });
      throw err;
    }
  },

  recordMaterialOut: async (data) => {
    try {
      const res = await inventoryService.materialOut(data);
      return res;
    } catch (err) {
      set({ error: err.message });
      throw err;
    }
  },

  clearError: () => set({ error: null }),
}));

export default useInventoryStore;
