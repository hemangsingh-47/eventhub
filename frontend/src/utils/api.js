import axios from 'axios';

const getBaseURL = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  
  // If no env var, use relative '/api' (Works for Unified Deploy)
  if (!envUrl) return '/api';
  
  // If env var exists, make sure it ends with /api
  // We trim trailing slashes first to be safe
  const baseUrl = envUrl.replace(/\/$/, '');
  return baseUrl.endsWith('/api') ? baseUrl : `${baseUrl}/api`;
};

const api = axios.create({
  baseURL: getBaseURL(),
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
