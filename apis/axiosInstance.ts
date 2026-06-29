import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080',
  withCredentials: true,
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(` [API Request] : Sending ${config.method?.toUpperCase()} to ${config.url}`);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Log error to console in development mode
    if (process.env.NODE_ENV === 'development') {
      console.group(' [Frontend API Error] ');
      console.error(`URL: ${error.config?.url}`);
      console.error(`Method: ${error.config?.method}`);
      console.error(`Status: ${error.response?.status}`);
      console.error(`Message: ${error.response?.data?.message || error.message}`);
      if (error.response?.data) console.error('Data:', error.response.data);
      console.groupEnd();
    }

    if (error.response?.status === 401) {
      // Handle unauthorized error (clear user store cache)
      if (typeof window !== 'undefined') {
        localStorage.removeItem('user');
      }
    }
    return Promise.reject(error);
  }
);

export default api;
