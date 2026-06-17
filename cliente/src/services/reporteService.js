import api from './api';


export const reporteService = {
  // Reportadores
  createReportador: async (data) => {
    const response = await api.post('/reportadores', data);
    return response.data;
  },

  // Notas
  getNotasProblema: async () => {
    const response = await api.get('/notas');
    return response.data;
  },
  createNota: async (data) => {
    const response = await api.post('/notas', data);
    return response.data;
  },

  // Detalles
  getDetalles: async () => {
    const response = await api.get('/detalles');
    return response.data;
  },
  createDetalle: async (data) => {
    const response = await api.post('/detalles', data);
    return response.data;
  },
  updateDetalle: async (id, data) => {
    const response = await api.put(`/detalles/${id}`, data);
    return response.data;
  },

  // Tipos
  getTiposIncidencia: async () => {
    const response = await api.get('/tipos-incidencia');
    return response.data;
  }
};