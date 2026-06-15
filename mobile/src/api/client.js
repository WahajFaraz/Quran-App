import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../config/constants';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
});

apiClient.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    if (error.code === 'ECONNABORTED') {
      return Promise.reject({ message: 'Request timed out. Check your connection.' });
    }
    if (!error.response) {
      return Promise.reject({ message: 'Cannot reach server. Check your connection.' });
    }
    const message =
      error.response?.data?.error?.message ||
      error.message ||
      'Something went wrong';
    return Promise.reject({ message, status: error.response?.status });
  }
);

export default apiClient;
