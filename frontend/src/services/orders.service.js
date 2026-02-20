import api from './api';

export const ordersService = {
  getAll: async (params = {}) => {
    const response = await api.get('/orders', { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },

  create: async (orderData) => {
    const response = await api.post('/orders', orderData);
    return response.data;
  },

  update: async (id, orderData) => {
    const response = await api.put(`/orders/${id}`, orderData);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/orders/${id}`);
    return response.data;
  },

  updateStatus: async (id, status, notes) => {
    const response = await api.put(`/orders/${id}/status`, { status, notes });
    return response.data;
  },

  updatePriority: async (id, priority) => {
    const response = await api.put(`/orders/${id}/priority`, { priority });
    return response.data;
  },

  getItems: async (id) => {
    const response = await api.get(`/orders/${id}/items`);
    return response.data;
  },

  addItem: async (id, itemData) => {
    const response = await api.post(`/orders/${id}/items`, itemData);
    return response.data;
  },

  getWorkflow: async (id, itemId) => {
    const response = await api.get(`/orders/${id}/items/${itemId}/workflow`);
    return response.data;
  },

  startWorkflowStage: async (id, itemId, stageData) => {
    const response = await api.post(`/orders/${id}/items/${itemId}/workflow`, stageData);
    return response.data;
  },

  updateWorkflowStage: async (id, itemId, wfId, data) => {
    const response = await api.put(`/orders/${id}/items/${itemId}/workflow/${wfId}`, data);
    return response.data;
  },

  transferWorkflowStage: async (id, itemId, wfId, data) => {
    const response = await api.post(
      `/orders/${id}/items/${itemId}/workflow/${wfId}/transfer`,
      data
    );
    return response.data;
  },

  getPayments: async (id) => {
    const response = await api.get(`/orders/${id}/payments`);
    return response.data;
  },

  addPayment: async (id, paymentData) => {
    const response = await api.post(`/orders/${id}/payments`, paymentData);
    return response.data;
  },
};

export default ordersService;
