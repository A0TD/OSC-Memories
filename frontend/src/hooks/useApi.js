import { useState, useCallback } from 'react';
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api', 
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

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