import axios from 'axios';

const getBaseURL = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  
  // If no env var, use relative '/api' (Works for Unified Deploy)
  if (!envUrl) return '/api';
  
  // If env var exists, make sure it ends with /api/
  // We trim trailing slashes first to be safe
  const baseUrl = envUrl.replace(/\/$/, '');
  const finalUrl = baseUrl.endsWith('/api') ? baseUrl : `${baseUrl}/api`;
  return `${finalUrl}/`;
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
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token to prevent infinite loops if the token is invalid/expired
      localStorage.removeItem('token');
      // Redirect to login if not already there
      if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
