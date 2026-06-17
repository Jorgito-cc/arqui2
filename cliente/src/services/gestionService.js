import api from './api';


export const gestionService = {
  // Asignaciones
  getAsignaciones: async () => {
    const response = await api.get('/asignaciones');
    return response.data;
  },
  createAsignacion: async (data) => {
    const response = await api.post('/asignaciones', data);
    return response.data;
  },

  // Historial y Estados
  getHistorial: async () => {
    const response = await api.get('/historial');
    return response.data;
  },
  createHistorial: async (data) => {
    const response = await api.post('/historial', data);
    return response.data;
  },

  // Evidencias
  getEvidencias: async () => {
    const response = await api.get('/evidencias');
    return response.data;
  },
  createEvidencia: async (formData) => {
    // Al enviar FormData, axios establece automáticamente el Content-Type a multipart/form-data
    const response = await api.post('/evidencias', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  }
};