import api from './api';

export const productsService = {
  getAll: async (params = {}) => {
    const response = await api.get('/products', { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await api.post('/products', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/products/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  },

  getCategories: async () => {
    const response = await api.get('/products/categories');
    return response.data;
  },

  getSizes: async (id) => {
    const response = await api.get(`/products/${id}/sizes`);
    return response.data;
  },

  getPrices: async (id) => {
    const response = await api.get(`/products/${id}/prices`);
    return response.data;
  },
};

export default productsService;
