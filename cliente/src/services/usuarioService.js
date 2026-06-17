import api from './api';


export const usuarioService = {
  getUsuarios: async () => {
    const response = await api.get('/usuarios');
    return response.data;
  },
  getUsuario: async (id) => {
    const response = await api.get(`/usuarios/${id}`);
    return response.data;
  },
  createUsuario: async (data) => {
    const response = await api.post('/usuarios', data);
    return response.data;
  },
  updateUsuario: async (id, data) => {
    const response = await api.put(`/usuarios/${id}`, data);
    return response.data;
  },
  deleteUsuario: async (id) => {
    const response = await api.delete(`/usuarios/${id}`);
    return response.data;
  },
  getRoles: async () => {
    const response = await api.get('/roles');
    return response.data;
  }
};