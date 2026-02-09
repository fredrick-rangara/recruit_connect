import axios from 'axios';

const api = axios.create({
  baseURL: '/api', // Vite will now prepend http://localhost:5000 automatically
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;