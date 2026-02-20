import { create } from 'zustand';
import ordersService from '../services/orders.service';

const useOrderStore = create((set, get) => ({
  orders: [],
  currentOrder: null,
  loading: false,
  error: null,
  pagination: { page: 1, limit: 20, total: 0 },
  filters: { status: '', priority: '', search: '' },

  setFilters: (filters) => set({ filters: { ...get().filters, ...filters } }),

  fetchOrders: async (params = {}) => {
    set({ loading: true, error: null });
    try {
      const data = await ordersService.getAll({ ...get().filters, ...params });
      set({
        orders: data.orders || [],
        pagination: data.pagination || get().pagination,
        loading: false,
      });
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },

  fetchOrderById: async (id) => {
    set({ loading: true, error: null });
    try {
      const data = await ordersService.getById(id);
      set({ currentOrder: data.order, loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },

  createOrder: async (orderData) => {
    set({ loading: true, error: null });
    try {
      const data = await ordersService.create(orderData);
      set((state) => ({
        orders: [data.order, ...state.orders],
        loading: false,
      }));
      return data.order;
    } catch (err) {
      set({ error: err.message, loading: false });
      throw err;
    }
  },

  updateOrder: async (id, orderData) => {
    set({ loading: true, error: null });
    try {
      const data = await ordersService.update(id, orderData);
      set((state) => ({
        orders: state.orders.map((o) => (o.id === id ? data.order : o)),
        currentOrder: data.order,
        loading: false,
      }));
      return data.order;
    } catch (err) {
      set({ error: err.message, loading: false });
      throw err;
    }
  },

  deleteOrder: async (id) => {
    try {
      await ordersService.delete(id);
      set((state) => ({
        orders: state.orders.filter((o) => o.id !== id),
      }));
    } catch (err) {
      set({ error: err.message });
      throw err;
    }
  },

  updateStatus: async (id, status, notes) => {
    try {
      const data = await ordersService.updateStatus(id, status, notes);
      set((state) => ({
        orders: state.orders.map((o) => (o.id === id ? { ...o, status } : o)),
        currentOrder:
          state.currentOrder?.id === id
            ? { ...state.currentOrder, status }
            : state.currentOrder,
      }));
      return data;
    } catch (err) {
      set({ error: err.message });
      throw err;
    }
  },

  clearError: () => set({ error: null }),
}));

export default useOrderStore;
