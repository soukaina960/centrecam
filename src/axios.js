// src/axios.js
import axios from 'axios';

// URL de ton API
const api = axios.create({
  baseURL: 'http://localhost/api', // Change l'URL selon ton serveur
  withCredentials: true,  // Important pour envoyer les cookies avec Sanctum
});

// Optionnel : Ajouter un token d'authentification dans les headers si l'utilisateur est connecté
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
