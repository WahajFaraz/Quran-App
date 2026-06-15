import { create } from 'zustand';
import { quranApi } from '../api';
import { cacheQuranData, getCachedSurah, cacheSurahMeta, getCachedSurahMeta } from '../services/storage.service';

export const useQuranStore = create((set, get) => ({
  surahs: [],
  currentSurah: null,
  bookmarks: [],
  searchResults: [],
  qaris: [],
  isLoading: false,
  error: null,
  hifzMode: false,
  hiddenAyahs: [],
  highlightedAyah: null,
  lastReading: { surahNumber: 1, ayahNumber: 1 },
  isOffline: false,

  fetchSurahs: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await quranApi.getSurahs();
      await cacheSurahMeta(response.data);
      set({ surahs: response.data, isLoading: false, isOffline: false });
    } catch (error) {
      const cached = await getCachedSurahMeta();
      if (cached) {
        set({ surahs: cached, isLoading: false, isOffline: true });
      } else {
        set({ error: error.message, isLoading: false });
      }
    }
  },

  fetchSurah: async (number) => {
    set({ isLoading: true, error: null });
    try {
      const response = await quranApi.getSurah(number);
      await cacheQuranData(number, response.data);
      set({ currentSurah: response.data, isLoading: false, isOffline: false });
      return response.data;
    } catch (error) {
      const cached = await getCachedSurah(number);
      if (cached) {
        set({ currentSurah: cached, isLoading: false, isOffline: true });
        return cached;
      }
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  searchQuran: async (query) => {
    if (!query || query.length < 2) {
      set({ searchResults: [] });
      return;
    }
    set({ isLoading: true });
    try {
      const response = await quranApi.search(query);
      set({ searchResults: response.data, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  fetchBookmarks: async () => {
    try {
      const response = await quranApi.getBookmarks();
      set({ bookmarks: response.data });
    } catch (error) {
      console.error('Bookmarks error:', error);
    }
  },

  addBookmark: async (surahNumber, ayahNumber, note = '') => {
    const response = await quranApi.createBookmark({
      type: 'ayah',
      surahNumber,
      ayahNumber,
      note,
    });
    set({ bookmarks: [response.data, ...get().bookmarks] });
    return response.data;
  },

  removeBookmark: async (id) => {
    await quranApi.deleteBookmark(id);
    set({ bookmarks: get().bookmarks.filter((b) => b._id !== id) });
  },

  fetchQaris: async () => {
    try {
      const response = await quranApi.getQaris();
      set({ qaris: response.data });
    } catch (error) {
      console.error('Qaris error:', error);
    }
  },

  setHifzMode: (enabled) => set({ hifzMode: enabled }),
  setHiddenAyahs: (ayahs) => set({ hiddenAyahs: ayahs }),
  setHighlightedAyah: (ayah) => set({ highlightedAyah: ayah }),
  setLastReading: (position) => set({ lastReading: position }),

  saveLastReading: async (position) => {
    set({ lastReading: position });
    try {
      await quranApi.updateLastReading(position);
    } catch (error) {
      console.error('Save reading error:', error);
    }
  },
}));
