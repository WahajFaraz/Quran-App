import apiClient from './client';

export const authApi = {
  register: (data) => apiClient.post('/auth/register', data),
  login: (data) => apiClient.post('/auth/login', data),
  aalimRegister: (data) => apiClient.post('/auth/aalim/register', data),
  aalimLogin: (data) => apiClient.post('/auth/aalim/login', data),
  deleteAccount: () => apiClient.delete('/auth/account'),
};

export const userApi = {
  getMe: () => apiClient.get('/users/me'),
  updateMe: (data) => apiClient.patch('/users/me', data),
  updatePreferences: (data) => apiClient.patch('/users/me/preferences', data),
  updateFcmToken: (fcmToken) => apiClient.post('/users/me/fcm-token', { fcmToken }),
  getReadingHistory: (page = 1) => apiClient.get(`/users/me/reading-history?page=${page}`),
  getNotifications: () => apiClient.get('/users/me/notifications'),
};

export const quranApi = {
  getSurahs: () => apiClient.get('/quran/surahs'),
  getSurah: (number) => apiClient.get(`/quran/surahs/${number}`),
  getParas: () => apiClient.get('/quran/paras'),
  getPara: (number) => apiClient.get(`/quran/paras/${number}`),
  getAyah: (surah, ayah) => apiClient.get(`/quran/ayahs/${surah}/${ayah}`),
  search: (q) => apiClient.get(`/quran/search?q=${encodeURIComponent(q)}`),
  getTafseer: (surah, ayah) => apiClient.get(`/quran/tafseer/${surah}/${ayah}`),
  getQaris: () => apiClient.get('/quran/qaris'),
  getAudio: (qari, surah, ayah) => apiClient.get(`/quran/audio/${qari}/${surah}/${ayah}`),
  createBookmark: (data) => apiClient.post('/quran/bookmarks', data),
  getBookmarks: (type) => apiClient.get(`/quran/bookmarks${type ? `?type=${type}` : ''}`),
  deleteBookmark: (id) => apiClient.delete(`/quran/bookmarks/${id}`),
  updateLastReading: (data) => apiClient.patch('/quran/last-reading', data),
};

export const hifzApi = {
  getProgress: () => apiClient.get('/hifz/progress'),
  getSurahProgress: (surah) => apiClient.get(`/hifz/progress/${surah}`),
  markAyahs: (surah, ayahNumbers) =>
    apiClient.patch(`/hifz/progress/${surah}/ayahs`, { ayahNumbers }),
  setHiddenAyahs: (surah, ayahNumbers) =>
    apiClient.patch(`/hifz/progress/${surah}/hidden`, { ayahNumbers }),
  addMistake: (surah, ayahNumber, note) =>
    apiClient.post(`/hifz/progress/${surah}/mistakes`, { ayahNumber, note }),
  getDashboard: () => apiClient.get('/hifz/dashboard'),
  setDailyGoal: (dailyGoal) => apiClient.patch('/hifz/daily-goal', { dailyGoal }),
};

export const qaApi = {
  getCategories: () => apiClient.get('/qa/categories'),
  getQuestions: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiClient.get(`/qa/questions?${query}`);
  },
  createQuestion: (data) => apiClient.post('/qa/questions', data),
  getQuestion: (id) => apiClient.get(`/qa/questions/${id}`),
  getMyQuestions: () => apiClient.get('/qa/questions/my/list'),
  createAnswer: (questionId, data) => apiClient.post(`/qa/questions/${questionId}/answers`, data),
  acceptAnswer: (answerId) => apiClient.patch(`/qa/answers/${answerId}/accept`),
  markHelpful: (answerId) => apiClient.post(`/qa/answers/${answerId}/helpful`),
};

export const hadithApi = {
  getCollections: () => apiClient.get('/hadith/collections'),
  getBooks: (collection) => apiClient.get(`/hadith/${collection}/books`),
  getChapters: (collection, book) =>
    apiClient.get(`/hadith/${collection}/books/${book}/chapters`),
  getHadith: (collection, number) => apiClient.get(`/hadith/${collection}/${number}`),
  getChapterHadiths: (collection, book, chapter) =>
    apiClient.get(`/hadith/${collection}/books/${book}/chapters/${chapter}`),
  search: (q, collection) => {
    const params = new URLSearchParams({ q });
    if (collection) params.append('collection', collection);
    return apiClient.get(`/hadith/search?${params}`);
  },
};

export const prayerApi = {
  getTimes: (lat, lng, method = 2) =>
    apiClient.get(`/prayer/times?lat=${lat}&lng=${lng}&method=${method}`),
  getQibla: (lat, lng) => apiClient.get(`/prayer/qibla?lat=${lat}&lng=${lng}`),
  getMasajid: (lat, lng, radius = 5000) =>
    apiClient.get(`/prayer/masajid?lat=${lat}&lng=${lng}&radius=${radius}`),
};

export const aalimApi = {
  getProfile: () => apiClient.get('/aalim/profile/me'),
  updateProfile: (data) => apiClient.patch('/aalim/profile/me', data),
  uploadCertificates: (data) => apiClient.post('/aalim/certificates', data),
  getPendingQuestions: () => apiClient.get('/aalim/questions/pending'),
  getAnsweredQuestions: () => apiClient.get('/aalim/questions/answered'),
};

export const adminApi = {
  getDashboard: () => apiClient.get('/admin/dashboard'),
  getUsers: (page = 1) => apiClient.get(`/admin/users?page=${page}`),
  updateUser: (id, data) => apiClient.patch(`/admin/users/${id}`, data),
  getPendingAalims: () => apiClient.get('/admin/aalims/pending'),
  verifyAalim: (id) => apiClient.patch(`/admin/aalims/${id}/verify`),
  rejectAalim: (id, reason) => apiClient.patch(`/admin/aalims/${id}/reject`, { reason }),
  getCategories: () => apiClient.get('/admin/categories'),
  createCategory: (data) => apiClient.post('/admin/categories', data),
  getReports: () => apiClient.get('/admin/reports'),
  resolveReport: (id, status) => apiClient.patch(`/admin/reports/${id}`, { status }),
};
