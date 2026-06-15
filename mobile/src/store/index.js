import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { hifzApi } from '../api';

export { useAuthStore } from './authStore';
export { useQuranStore } from './quranStore';

export const useHifzStore = create((set, get) => ({
  dashboard: null,
  surahProgress: null,
  allProgress: [],
  isLoading: false,
  error: null,

  fetchDashboard: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await hifzApi.getDashboard();
      set({ dashboard: response.data, allProgress: response.data.surahProgress, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  fetchSurahProgress: async (surahNumber) => {
    set({ isLoading: true });
    try {
      const response = await hifzApi.getSurahProgress(surahNumber);
      set({ surahProgress: response.data, isLoading: false });
      return response.data;
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  markMemorized: async (surahNumber, ayahNumbers) => {
    const response = await hifzApi.markAyahs(surahNumber, ayahNumbers);
    set({ surahProgress: response.data });
    return response.data;
  },

  setHiddenForRevision: async (surahNumber, ayahNumbers) => {
    const response = await hifzApi.setHiddenAyahs(surahNumber, ayahNumbers);
    set({ surahProgress: response.data });
    return response.data;
  },

  addMistakeNote: async (surahNumber, ayahNumber, note) => {
    const response = await hifzApi.addMistake(surahNumber, ayahNumber, note);
    set({ surahProgress: response.data });
    return response.data;
  },

  setDailyGoal: async (dailyGoal) => {
    await hifzApi.setDailyGoal(dailyGoal);
    const dashboard = get().dashboard;
    if (dashboard) {
      set({ dashboard: { ...dashboard, dailyGoal } });
    }
  },
}));

export const useSettingsStore = create((set) => ({
  darkMode: false,
  language: 'en',
  mushafLayout: '15',
  fontSize: 24,
  showTranslation: true,
  showTafseer: false,
  qariId: 'abdul_basit',
  azanNotifications: true,

  initialize: async () => {
    try {
      const settings = await AsyncStorage.getItem('app_settings');
      if (settings) set(JSON.parse(settings));
    } catch (error) {
      console.error('Settings init error:', error);
    }
  },

  updateSetting: async (key, value) => {
    set({ [key]: value });
    const state = useSettingsStore.getState();
    const settings = {
      darkMode: state.darkMode,
      language: state.language,
      mushafLayout: state.mushafLayout,
      fontSize: state.fontSize,
      showTranslation: state.showTranslation,
      showTafseer: state.showTafseer,
      qariId: state.qariId,
      azanNotifications: state.azanNotifications,
    };
    await AsyncStorage.setItem('app_settings', JSON.stringify(settings));
  },

  toggleDarkMode: () => {
    const newValue = !useSettingsStore.getState().darkMode;
    useSettingsStore.getState().updateSetting('darkMode', newValue);
  },
}));
