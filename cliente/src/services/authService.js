import api from './api';


export const login = async (data) => {
  const response = await api.post('/login', data);
  return response.data;
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};