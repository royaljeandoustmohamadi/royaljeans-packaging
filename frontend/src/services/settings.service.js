import api from './api';

export const settingsService = {
  // Production Suppliers
  getProductionSuppliers: async () => {
    const response = await api.get('/settings/production-suppliers');
    return response.data;
  },
  createProductionSupplier: async (data) => {
    const response = await api.post('/settings/production-suppliers', data);
    return response.data;
  },
  updateProductionSupplier: async (id, data) => {
    const response = await api.put(`/settings/production-suppliers/${id}`, data);
    return response.data;
  },
  deleteProductionSupplier: async (id) => {
    const response = await api.delete(`/settings/production-suppliers/${id}`);
    return response.data;
  },

  // Fabric Suppliers
  getFabricSuppliers: async () => {
    const response = await api.get('/settings/fabric-suppliers');
    return response.data;
  },
  createFabricSupplier: async (data) => {
    const response = await api.post('/settings/fabric-suppliers', data);
    return response.data;
  },
  updateFabricSupplier: async (id, data) => {
    const response = await api.put(`/settings/fabric-suppliers/${id}`, data);
    return response.data;
  },
  deleteFabricSupplier: async (id) => {
    const response = await api.delete(`/settings/fabric-suppliers/${id}`);
    return response.data;
  },

  // Fabrics
  getFabrics: async () => {
    const response = await api.get('/settings/fabrics');
    return response.data;
  },
  createFabric: async (data) => {
    const response = await api.post('/settings/fabrics', data);
    return response.data;
  },
  updateFabric: async (id, data) => {
    const response = await api.put(`/settings/fabrics/${id}`, data);
    return response.data;
  },
  deleteFabric: async (id) => {
    const response = await api.delete(`/settings/fabrics/${id}`);
    return response.data;
  },

  // Stone Washes
  getStoneWashes: async () => {
    const response = await api.get('/settings/stone-washes');
    return response.data;
  },
  createStoneWash: async (data) => {
    const response = await api.post('/settings/stone-washes', data);
    return response.data;
  },
  updateStoneWash: async (id, data) => {
    const response = await api.put(`/settings/stone-washes/${id}`, data);
    return response.data;
  },
  deleteStoneWash: async (id) => {
    const response = await api.delete(`/settings/stone-washes/${id}`);
    return response.data;
  },

  // Packing Names
  getPackingNames: async () => {
    const response = await api.get('/settings/packing-names');
    return response.data;
  },
  createPackingName: async (data) => {
    const response = await api.post('/settings/packing-names', data);
    return response.data;
  },
  updatePackingName: async (id, data) => {
    const response = await api.put(`/settings/packing-names/${id}`, data);
    return response.data;
  },
  deletePackingName: async (id) => {
    const response = await api.delete(`/settings/packing-names/${id}`);
    return response.data;
  },

  // Styles
  getStyles: async () => {
    const response = await api.get('/settings/styles');
    return response.data;
  },
  createStyle: async (data) => {
    const response = await api.post('/settings/styles', data);
    return response.data;
  },
  updateStyle: async (id, data) => {
    const response = await api.put(`/settings/styles/${id}`, data);
    return response.data;
  },
  deleteStyle: async (id) => {
    const response = await api.delete(`/settings/styles/${id}`);
    return response.data;
  },

  // Order Types (BU)
  getOrderTypes: async () => {
    const response = await api.get('/settings/order-types');
    return response.data;
  },
  createOrderType: async (data) => {
    const response = await api.post('/settings/order-types', data);
    return response.data;
  },
  updateOrderType: async (id, data) => {
    const response = await api.put(`/settings/order-types/${id}`, data);
    return response.data;
  },
  deleteOrderType: async (id) => {
    const response = await api.delete(`/settings/order-types/${id}`);
    return response.data;
  },

  // Order Levels (BV)
  getOrderLevels: async () => {
    const response = await api.get('/settings/order-levels');
    return response.data;
  },
  createOrderLevel: async (data) => {
    const response = await api.post('/settings/order-levels', data);
    return response.data;
  },
  updateOrderLevel: async (id, data) => {
    const response = await api.put(`/settings/order-levels/${id}`, data);
    return response.data;
  },
  deleteOrderLevel: async (id) => {
    const response = await api.delete(`/settings/order-levels/${id}`);
    return response.data;
  },

  // Get all settings at once
  getAll: async () => {
    const response = await api.get('/settings/all');
    return response.data;
  },
};

export default settingsService;
