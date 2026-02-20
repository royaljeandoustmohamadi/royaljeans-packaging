import api from './api';

export const workflowService = {
  getStages: async () => {
    const response = await api.get('/workflow/stages');
    return response.data;
  },

  getOrderWorkflow: async (orderId, itemId) => {
    const response = await api.get(`/orders/${orderId}/items/${itemId}/workflow`);
    return response.data;
  },

  startStage: async (orderId, itemId, data) => {
    const response = await api.post(`/orders/${orderId}/items/${itemId}/workflow`, data);
    return response.data;
  },

  updateStage: async (orderId, itemId, wfId, data) => {
    const response = await api.put(
      `/orders/${orderId}/items/${itemId}/workflow/${wfId}`,
      data
    );
    return response.data;
  },

  transferStage: async (orderId, itemId, wfId, data) => {
    const response = await api.post(
      `/orders/${orderId}/items/${itemId}/workflow/${wfId}/transfer`,
      data
    );
    return response.data;
  },

  recordWaste: async (orderId, itemId, wfId, data) => {
    const response = await api.post(
      `/orders/${orderId}/items/${itemId}/workflow/${wfId}/waste`,
      data
    );
    return response.data;
  },
};

export default workflowService;
