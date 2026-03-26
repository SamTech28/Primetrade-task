import axios from 'axios';

// Create a custom axios instance
const api = axios.create({
  // This is the base URL of our Flask backend!
  baseURL: 'http://localhost:5000/api/v1',
});

// Axios Interceptor: This runs automatically BEFORE every single request
api.interceptors.request.use((config) => {
  // Grab the token from browser memory
  const token = localStorage.getItem('token');
  
  // If it exists, attach it to the Headers automatically!
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;
