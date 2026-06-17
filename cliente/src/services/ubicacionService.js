import api from './api';


export const ubicacionService = {
  // Facultades
  getFacultades: async () => {
    const response = await api.get('/facultades');
    return response.data;
  },
  createFacultad: async (data) => {
    const response = await api.post('/facultades', data);
    return response.data;
  },
  deleteFacultad: async (id) => {
    const response = await api.delete(`/facultades/${id}`);
    return response.data;
  },
  updateFacultad: async (id, data) => {
    const response = await api.put(`/facultades/${id}`, data);
    return response.data;
  },

  // Módulos
  getModulos: async () => {
    const response = await api.get('/modulos');
    return response.data;
  },
  createModulo: async (data) => {
    const response = await api.post('/modulos', data);
    return response.data;
  },
  deleteModulo: async (id) => {
    const response = await api.delete(`/modulos/${id}`);
    return response.data;
  },
  updateModulo: async (id, data) => {
    const response = await api.put(`/modulos/${id}`, data);
    return response.data;
  },

  // Ambientes
  getAmbientes: async () => {
    const response = await api.get('/ambientes');
    return response.data;
  },
  createAmbiente: async (data) => {
    const response = await api.post('/ambientes', data);
    return response.data;
  },
  deleteAmbiente: async (id) => {
    const response = await api.delete(`/ambientes/${id}`);
    return response.data;
  },
  updateAmbiente: async (id, data) => {
    const response = await api.put(`/ambientes/${id}`, data);
    return response.data;
  }
};