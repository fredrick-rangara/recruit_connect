import axios from 'axios';

const api = axios.create({
  // Matches the port in your app.py (app.run(port=5000))
  baseURL: 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// REQUEST INTERCEPTOR: Automatically attaches the JWT token to every call
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// RESPONSE INTERCEPTOR: Global error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If the backend returns 401 (Unauthorized), the token is likely expired or invalid
    if (error.response && error.response.status === 401) {
      console.warn("Session expired or unauthorized. Logging out...");
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Optional: window.location.href = '/login'; 
    }
    return Promise.reject(error);
  }
);

export default api;