import { useState, useCallback } from 'react';
import axios from 'axios';
import { STORAGE_KEYS } from '../utils/constants';

export const api = axios.create({
  baseURL: 'http://localhost:3000/api', 
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    let token = localStorage.getItem('token');

    if (!token) {
      try {
        const userKey = STORAGE_KEYS?.USER || 'user';
        const savedUser = localStorage.getItem(userKey);
        if (savedUser) {
          const parsedUser = JSON.parse(savedUser);
          token = parsedUser.token || parsedUser.accessToken;
        }
      } catch (err) {
        console.error('Error reading token from localStorage:', err);
      }
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const request = useCallback(async (config) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api(config);
      setLoading(false);
      return response.data;
    } catch (err) {
      setLoading(false);
      const errorMessage = err.response?.data?.message || 'حدث خطأ غير متوقع!';
      setError(errorMessage);
      throw err;
    }
  }, []);

  return { request, loading, error, setError };
};