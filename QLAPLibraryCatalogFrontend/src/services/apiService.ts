import axios from 'axios';

// Create a simple axios instance with base configuration
const api = axios.create({
  baseURL: import.meta.env.REACT_APP_API_BASE_URL || 'http://localhost:5236',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('authToken');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Clear auth data on 401 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      sessionStorage.clear();
    }
    return Promise.reject(error);
  }
);

export default api;