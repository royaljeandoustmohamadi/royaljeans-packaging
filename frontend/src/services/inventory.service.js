import api from './api';

export const inventoryService = {
  getProductStock: async (params = {}) => {
    const response = await api.get('/inventory/products', { params });
    return response.data;
  },

  getMaterialStock: async (params = {}) => {
    const response = await api.get('/inventory/materials', { params });
    return response.data;
  },

  getMaterialStockLevels: async () => {
    const response = await api.get('/inventory/materials/stock-levels');
    return response.data;
  },

  getLowStock: async () => {
    const response = await api.get('/inventory/materials/low-stock');
    return response.data;
  },

  productIn: async (data) => {
    const response = await api.post('/inventory/products/in', data);
    return response.data;
  },

  productOut: async (data) => {
    const response = await api.post('/inventory/products/out', data);
    return response.data;
  },

  materialIn: async (data) => {
    const response = await api.post('/inventory/materials/in', data);
    return response.data;
  },

  materialOut: async (data) => {
    const response = await api.post('/inventory/materials/out', data);
    return response.data;
  },

  adjustProduct: async (data) => {
    const response = await api.post('/inventory/products/adjust', data);
    return response.data;
  },

  adjustMaterial: async (data) => {
    const response = await api.post('/inventory/materials/adjust', data);
    return response.data;
  },

  getWarehouses: async () => {
    const response = await api.get('/inventory/warehouses');
    return response.data;
  },

  getProductMovements: async (params = {}) => {
    const response = await api.get('/inventory/products/movements', { params });
    return response.data;
  },

  getMaterialMovements: async (params = {}) => {
    const response = await api.get('/inventory/materials/movements', { params });
    return response.data;
  },
};

export default inventoryService;
