import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authApi, userApi } from '../api';

export const useAuthStore = create((set, get) => ({
  user: null,
  token: null,
  isLoading: true,
  isAuthenticated: false,
  error: null,

  initialize: async () => {
    try {
      const [token, userStr] = await Promise.all([
        AsyncStorage.getItem('auth_token'),
        AsyncStorage.getItem('user_data'),
      ]);
      if (token && userStr) {
        set({ token, user: JSON.parse(userStr), isAuthenticated: true, isLoading: false });
        try {
          const response = await userApi.getMe();
          set({ user: response.data });
        } catch {
          // use cached user when backend unreachable
        }
        return;
      }
    } catch (error) {
      console.error('Auth init error:', error);
    }
    set({ isLoading: false });
  },

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authApi.login({ email, password });
      const { user, token } = response.data;
      await AsyncStorage.setItem('auth_token', token);
      await AsyncStorage.setItem('user_data', JSON.stringify(user));
      set({ user, token, isAuthenticated: true, isLoading: false });
      return user;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  register: async (name, email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authApi.register({ name, email, password });
      set({ isLoading: false });
      return response.data;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  aalimLogin: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authApi.aalimLogin({ email, password });
      const { user, token, aalim } = response.data;
      await AsyncStorage.setItem('auth_token', token);
      await AsyncStorage.setItem('user_data', JSON.stringify({ ...user, aalim }));
      set({ user: { ...user, aalim }, token, isAuthenticated: true, isLoading: false });
      return user;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  logout: async () => {
    await AsyncStorage.multiRemove(['auth_token', 'user_data']);
    set({ user: null, token: null, isAuthenticated: false, error: null });
  },

  updateUser: (updates) => {
    const user = { ...get().user, ...updates };
    set({ user });
    AsyncStorage.setItem('user_data', JSON.stringify(user));
  },
}));
