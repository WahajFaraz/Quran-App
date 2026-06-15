import AsyncStorage from '@react-native-async-storage/async-storage';

const OFFLINE_QURAN_KEY = 'offline_quran_data';
const OFFLINE_SURAH_KEY = 'offline_surah_meta';

export const cacheQuranData = async (surahNumber, surahData) => {
  try {
    const existing = await AsyncStorage.getItem(OFFLINE_QURAN_KEY);
    const cache = existing ? JSON.parse(existing) : {};
    cache[surahNumber] = { data: surahData, cachedAt: Date.now() };
    await AsyncStorage.setItem(OFFLINE_QURAN_KEY, JSON.stringify(cache));
  } catch (error) {
    console.error('Cache error:', error);
  }
};

export const getCachedSurah = async (surahNumber) => {
  try {
    const existing = await AsyncStorage.getItem(OFFLINE_QURAN_KEY);
    if (!existing) return null;
    const cache = JSON.parse(existing);
    return cache[surahNumber]?.data || null;
  } catch {
    return null;
  }
};

export const cacheSurahMeta = async (surahs) => {
  await AsyncStorage.setItem(OFFLINE_SURAH_KEY, JSON.stringify(surahs));
};

export const getCachedSurahMeta = async () => {
  try {
    const data = await AsyncStorage.getItem(OFFLINE_SURAH_KEY);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
};

export const clearOfflineCache = async () => {
  await AsyncStorage.multiRemove([OFFLINE_QURAN_KEY, OFFLINE_SURAH_KEY]);
};
