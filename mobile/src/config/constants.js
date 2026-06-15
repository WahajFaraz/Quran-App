// USB mode (adb reverse): change to 'localhost'
// WiFi mode: use your PC IP shown in Expo terminal (e.g. 192.168.1.42)
const DEV_HOST = '192.168.1.42';

export const API_BASE_URL = __DEV__
  ? `http://${DEV_HOST}:5000/api/v1`
  : 'https://api.quranapp.com/api/v1';

export const MUSHAF_LAYOUTS = [
  { id: '15', label: '15 Lines', lines: 15 },
  { id: '16', label: '16 Lines', lines: 16 },
  { id: '17', label: '17 Lines', lines: 17 },
  { id: '21', label: '21 Lines', lines: 21 },
];

export const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'ar', label: 'العربية' },
  { code: 'ur', label: 'اردو' },
];

export const PRAYER_NAMES = ['fajr', 'sunrise', 'dhuhr', 'asr', 'maghrib', 'isha'];

export const PRAYER_LABELS = {
  fajr: 'Fajr',
  sunrise: 'Sunrise',
  dhuhr: 'Dhuhr',
  asr: 'Asr',
  maghrib: 'Maghrib',
  isha: 'Isha',
};
