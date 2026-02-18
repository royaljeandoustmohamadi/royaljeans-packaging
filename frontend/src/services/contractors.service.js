import api from './api';

export const contractorsService = {
  getAll: async (params = {}) => {
    const response = await api.get('/contractors', { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/contractors/${id}`);
    return response.data;
  },

  create: async (contractorData) => {
    const response = await api.post('/contractors', contractorData);
    return response.data;
  },

  update: async (id, contractorData) => {
    const response = await api.put(`/contractors/${id}`, contractorData);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/contractors/${id}`);
    return response.data;
  },

  createEvaluation: async (id, evaluationData) => {
    const response = await api.post(`/contractors/${id}/evaluations`, evaluationData);
    return response.data;
  },

  getEvaluations: async (id, params = {}) => {
    const response = await api.get(`/contractors/${id}/evaluations`, { params });
    return response.data;
  },
};

export default contractorsService;
