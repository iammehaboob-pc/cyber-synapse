import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create a custom Axios instance pointing to our backend
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Automatically inject JWT Token to Authorization header if present in localStorage
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

// Authentication service methods
export const authService = {
  register: async (username, email, password) => {
    const response = await api.post('/register', { username, email, password });
    return response.data;
  },
  login: async (email, password) => {
    const response = await api.post('/login', { email, password });
    return response.data;
  }
};

// User/Game service methods
export const userService = {
  getLeaderboard: async () => {
    const response = await api.get('/leaderboard');
    return response.data;
  },
  saveScore: async (score, outcome) => {
    const response = await api.post('/save-score', { score, outcome });
    return response.data;
  },
  getProfile: async () => {
    const response = await api.get('/profile');
    return response.data;
  },
  updateProfile: async (profileData) => {
    const response = await api.put('/profile', profileData);
    return response.data;
  },
  deleteAccount: async () => {
    const response = await api.delete('/account');
    return response.data;
  }
};

export default api;
