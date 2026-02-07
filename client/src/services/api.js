import axios from 'axios';

const api = axios.create({
  // Use your backend URL (usually 5000 or 8000)
  baseURL: 'http://localhost:5000/api', 
});

// This adds the token to every request if the user is logged in
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;