const fs = require('fs');
const path = require('path');

const SURAH_META_PATH = path.join(__dirname, '../../data/surahs.json');
const QURAN_DATA_PATH = path.join(__dirname, '../../data/quran-sample.json');

const SURAH_NAMES = {
  1: { name: 'Al-Fatihah', nameAr: 'الفاتحة', revelationType: 'Meccan' },
  2: { name: 'Al-Baqarah', nameAr: 'البقرة', revelationType: 'Medinan' },
  3: { name: "Ali 'Imran", nameAr: 'آل عمران', revelationType: 'Medinan' },
  4: { name: 'An-Nisa', nameAr: 'النساء', revelationType: 'Medinan' },
  5: { name: "Al-Ma'idah", nameAr: 'المائدة', revelationType: 'Medinan' },
  6: { name: "Al-An'am", nameAr: 'الأنعام', revelationType: 'Meccan' },
  7: { name: "Al-A'raf", nameAr: 'الأعراف', revelationType: 'Meccan' },
  8: { name: 'Al-Anfal', nameAr: 'الأنفال', revelationType: 'Medinan' },
  9: { name: 'At-Tawbah', nameAr: 'التوبة', revelationType: 'Medinan' },
  10: { name: 'Yunus', nameAr: 'يونس', revelationType: 'Meccan' },
  11: { name: 'Hud', nameAr: 'هود', revelationType: 'Meccan' },
  12: { name: 'Yusuf', nameAr: 'يوسف', revelationType: 'Meccan' },
  13: { name: "Ar-Ra'd", nameAr: 'الرعد', revelationType: 'Medinan' },
  14: { name: 'Ibrahim', nameAr: 'إبراهيم', revelationType: 'Meccan' },
  15: { name: 'Al-Hijr', nameAr: 'الحجر', revelationType: 'Meccan' },
  16: { name: 'An-Nahl', nameAr: 'النحل', revelationType: 'Meccan' },
  17: { name: 'Al-Isra', nameAr: 'الإسراء', revelationType: 'Meccan' },
  18: { name: 'Al-Kahf', nameAr: 'الكهف', revelationType: 'Meccan' },
  19: { name: 'Maryam', nameAr: 'مريم', revelationType: 'Meccan' },
  20: { name: 'Ta-Ha', nameAr: 'طه', revelationType: 'Meccan' },
  21: { name: 'Al-Anbiya', nameAr: 'الأنبياء', revelationType: 'Meccan' },
  22: { name: 'Al-Hajj', nameAr: 'الحج', revelationType: 'Medinan' },
  23: { name: "Al-Mu'minun", nameAr: 'المؤمنون', revelationType: 'Meccan' },
  24: { name: 'An-Nur', nameAr: 'النور', revelationType: 'Medinan' },
  25: { name: 'Al-Furqan', nameAr: 'الفرقان', revelationType: 'Meccan' },
  26: { name: "Ash-Shu'ara", nameAr: 'الشعراء', revelationType: 'Meccan' },
  27: { name: 'An-Naml', nameAr: 'النمل', revelationType: 'Meccan' },
  28: { name: 'Al-Qasas', nameAr: 'القصص', revelationType: 'Meccan' },
  29: { name: "Al-'Ankabut", nameAr: 'العنكبوت', revelationType: 'Meccan' },
  30: { name: 'Ar-Rum', nameAr: 'الروم', revelationType: 'Meccan' },
  31: { name: 'Luqman', nameAr: 'لقمان', revelationType: 'Meccan' },
  32: { name: 'As-Sajdah', nameAr: 'السجدة', revelationType: 'Meccan' },
  33: { name: 'Al-Ahzab', nameAr: 'الأحزاب', revelationType: 'Medinan' },
  34: { name: 'Saba', nameAr: 'سبأ', revelationType: 'Meccan' },
  35: { name: 'Fatir', nameAr: 'فاطر', revelationType: 'Meccan' },
  36: { name: 'Ya-Sin', nameAr: 'يس', revelationType: 'Meccan' },
  37: { name: 'As-Saffat', nameAr: 'الصافات', revelationType: 'Meccan' },
  38: { name: 'Sad', nameAr: 'ص', revelationType: 'Meccan' },
  39: { name: 'Az-Zumar', nameAr: 'الزمر', revelationType: 'Meccan' },
  40: { name: 'Ghafir', nameAr: 'غافر', revelationType: 'Meccan' },
  41: { name: 'Fussilat', nameAr: 'فصلت', revelationType: 'Meccan' },
  42: { name: 'Ash-Shura', nameAr: 'الشورى', revelationType: 'Meccan' },
  43: { name: 'Az-Zukhruf', nameAr: 'الزخرف', revelationType: 'Meccan' },
  44: { name: 'Ad-Dukhan', nameAr: 'الدخان', revelationType: 'Meccan' },
  45: { name: 'Al-Jathiyah', nameAr: 'الجاثية', revelationType: 'Meccan' },
  46: { name: 'Al-Ahqaf', nameAr: 'الأحقاف', revelationType: 'Meccan' },
  47: { name: 'Muhammad', nameAr: 'محمد', revelationType: 'Medinan' },
  48: { name: 'Al-Fath', nameAr: 'الفتح', revelationType: 'Medinan' },
  49: { name: 'Al-Hujurat', nameAr: 'الحجرات', revelationType: 'Medinan' },
  50: { name: 'Qaf', nameAr: 'ق', revelationType: 'Meccan' },
  51: { name: 'Adh-Dhariyat', nameAr: 'الذاريات', revelationType: 'Meccan' },
  52: { name: 'At-Tur', nameAr: 'الطور', revelationType: 'Meccan' },
  53: { name: 'An-Najm', nameAr: 'النجم', revelationType: 'Meccan' },
  54: { name: 'Al-Qamar', nameAr: 'القمر', revelationType: 'Meccan' },
  55: { name: 'Ar-Rahman', nameAr: 'الرحمن', revelationType: 'Medinan' },
  56: { name: "Al-Waqi'ah", nameAr: 'الواقعة', revelationType: 'Meccan' },
  57: { name: 'Al-Hadid', nameAr: 'الحديد', revelationType: 'Medinan' },
  58: { name: 'Al-Mujadila', nameAr: 'المجادلة', revelationType: 'Medinan' },
  59: { name: 'Al-Hashr', nameAr: 'الحشر', revelationType: 'Medinan' },
  60: { name: 'Al-Mumtahanah', nameAr: 'الممتحنة', revelationType: 'Medinan' },
  61: { name: 'As-Saf', nameAr: 'الصف', revelationType: 'Medinan' },
  62: { name: "Al-Jumu'ah", nameAr: 'الجمعة', revelationType: 'Medinan' },
  63: { name: 'Al-Munafiqun', nameAr: 'المنافقون', revelationType: 'Medinan' },
  64: { name: 'At-Taghabun', nameAr: 'التغابن', revelationType: 'Medinan' },
  65: { name: 'At-Talaq', nameAr: 'الطلاق', revelationType: 'Medinan' },
  66: { name: 'At-Tahrim', nameAr: 'التحريم', revelationType: 'Medinan' },
  67: { name: 'Al-Mulk', nameAr: 'الملك', revelationType: 'Meccan' },
  68: { name: 'Al-Qalam', nameAr: 'القلم', revelationType: 'Meccan' },
  69: { name: 'Al-Haqqah', nameAr: 'الحاقة', revelationType: 'Meccan' },
  70: { name: "Al-Ma'arij", nameAr: 'المعارج', revelationType: 'Meccan' },
  71: { name: 'Nuh', nameAr: 'نوح', revelationType: 'Meccan' },
  72: { name: 'Al-Jinn', nameAr: 'الجن', revelationType: 'Meccan' },
  73: { name: 'Al-Muzzammil', nameAr: 'المزمل', revelationType: 'Meccan' },
  74: { name: 'Al-Muddaththir', nameAr: 'المدثر', revelationType: 'Meccan' },
  75: { name: 'Al-Qiyamah', nameAr: 'القيامة', revelationType: 'Meccan' },
  76: { name: 'Al-Insan', nameAr: 'الإنسان', revelationType: 'Medinan' },
  77: { name: 'Al-Mursalat', nameAr: 'المرسلات', revelationType: 'Meccan' },
  78: { name: 'An-Naba', nameAr: 'النبأ', revelationType: 'Meccan' },
  79: { name: "An-Nazi'at", nameAr: 'النازعات', revelationType: 'Meccan' },
  80: { name: "'Abasa", nameAr: 'عبس', revelationType: 'Meccan' },
  81: { name: 'At-Takwir', nameAr: 'التكوير', revelationType: 'Meccan' },
  82: { name: 'Al-Infitar', nameAr: 'الانفطار', revelationType: 'Meccan' },
  83: { name: 'Al-Mutaffifin', nameAr: 'المطففين', revelationType: 'Meccan' },
  84: { name: 'Al-Inshiqaq', nameAr: 'الانشقاق', revelationType: 'Meccan' },
  85: { name: 'Al-Buruj', nameAr: 'البروج', revelationType: 'Meccan' },
  86: { name: 'At-Tariq', nameAr: 'الطارق', revelationType: 'Meccan' },
  87: { name: "Al-A'la", nameAr: 'الأعلى', revelationType: 'Meccan' },
  88: { name: 'Al-Ghashiyah', nameAr: 'الغاشية', revelationType: 'Meccan' },
  89: { name: 'Al-Fajr', nameAr: 'الفجر', revelationType: 'Meccan' },
  90: { name: 'Al-Balad', nameAr: 'البلد', revelationType: 'Meccan' },
  91: { name: 'Ash-Shams', nameAr: 'الشمس', revelationType: 'Meccan' },
  92: { name: 'Al-Layl', nameAr: 'الليل', revelationType: 'Meccan' },
  93: { name: 'Ad-Duha', nameAr: 'الضحى', revelationType: 'Meccan' },
  94: { name: 'Ash-Sharh', nameAr: 'الشرح', revelationType: 'Meccan' },
  95: { name: 'At-Tin', nameAr: 'التين', revelationType: 'Meccan' },
  96: { name: 'Al-Alaq', nameAr: 'العلق', revelationType: 'Meccan' },
  97: { name: 'Al-Qadr', nameAr: 'القدر', revelationType: 'Meccan' },
  98: { name: 'Al-Bayyinah', nameAr: 'البينة', revelationType: 'Medinan' },
  99: { name: 'Az-Zalzalah', nameAr: 'الزلزلة', revelationType: 'Medinan' },
  100: { name: "Al-'Adiyat", nameAr: 'العاديات', revelationType: 'Meccan' },
  101: { name: "Al-Qari'ah", nameAr: 'القارعة', revelationType: 'Meccan' },
  102: { name: 'At-Takathur', nameAr: 'التكاثر', revelationType: 'Meccan' },
  103: { name: "Al-'Asr", nameAr: 'العصر', revelationType: 'Meccan' },
  104: { name: 'Al-Humazah', nameAr: 'الهمزة', revelationType: 'Meccan' },
  105: { name: 'Al-Fil', nameAr: 'الفيل', revelationType: 'Meccan' },
  106: { name: 'Quraysh', nameAr: 'قريش', revelationType: 'Meccan' },
  107: { name: "Al-Ma'un", nameAr: 'الماعون', revelationType: 'Meccan' },
  108: { name: 'Al-Kawthar', nameAr: 'الكوثر', revelationType: 'Meccan' },
  109: { name: 'Al-Kafirun', nameAr: 'الكافرون', revelationType: 'Meccan' },
  110: { name: 'An-Nasr', nameAr: 'النصر', revelationType: 'Medinan' },
  111: { name: 'Al-Masad', nameAr: 'المسد', revelationType: 'Meccan' },
  112: { name: 'Al-Ikhlas', nameAr: 'الإخلاص', revelationType: 'Meccan' },
  113: { name: 'Al-Falaq', nameAr: 'الفلق', revelationType: 'Meccan' },
  114: { name: 'An-Nas', nameAr: 'الناس', revelationType: 'Meccan' },
};

let surahMeta = null;
let quranData = null;
let ayahIndex = null;

const cleanAyah = (ayah) => ({
  ...ayah,
  arabic: ayah.arabic?.replace(/\r/g, '').trim() || '',
  translation: ayah.translation?.trim() || '',
  transliteration: ayah.transliteration?.trim() || '',
});

const loadData = () => {
  if (!surahMeta) {
    if (fs.existsSync(SURAH_META_PATH)) {
      surahMeta = JSON.parse(fs.readFileSync(SURAH_META_PATH, 'utf8'));
    }
    if (!surahMeta || surahMeta.length < 114) {
      surahMeta = buildSurahMetaFromQuran();
      fs.writeFileSync(SURAH_META_PATH, JSON.stringify(surahMeta, null, 2));
    }
  }
  if (!quranData) {
    const raw = JSON.parse(fs.readFileSync(QURAN_DATA_PATH, 'utf8'));
    quranData = raw.map(cleanAyah);
    ayahIndex = {};
    quranData.forEach((a) => {
      if (!ayahIndex[a.surahNumber]) ayahIndex[a.surahNumber] = [];
      ayahIndex[a.surahNumber].push(a);
    });
  }
};

const buildSurahMetaFromQuran = () => {
  const raw = JSON.parse(fs.readFileSync(QURAN_DATA_PATH, 'utf8'));
  const counts = {};
  raw.forEach((a) => {
    counts[a.surahNumber] = (counts[a.surahNumber] || 0) + 1;
  });
  return Object.keys(counts)
    .map(Number)
    .sort((a, b) => a - b)
    .map((num) => {
      const info = SURAH_NAMES[num] || { name: `Surah ${num}`, nameAr: `سورة ${num}`, revelationType: 'Meccan' };
      return {
        number: num,
        name: info.name,
        nameAr: info.nameAr,
        revelationType: info.revelationType,
        numberOfAyahs: counts[num],
      };
    });
};

const getSurahs = () => {
  loadData();
  return surahMeta;
};

const getSurah = (number) => {
  loadData();
  const meta = surahMeta.find((s) => s.number === number);
  if (!meta) return null;
  const ayahs = ayahIndex[number] || [];
  return { ...meta, ayahs };
};

const getParas = () => {
  loadData();
  const JUZ_START = [
    { surah: 1, ayah: 1 }, { surah: 2, ayah: 142 }, { surah: 2, ayah: 253 },
    { surah: 3, ayah: 93 }, { surah: 4, ayah: 24 }, { surah: 4, ayah: 148 },
    { surah: 5, ayah: 82 }, { surah: 6, ayah: 111 }, { surah: 7, ayah: 88 },
    { surah: 8, ayah: 41 }, { surah: 9, ayah: 93 }, { surah: 11, ayah: 6 },
    { surah: 12, ayah: 53 }, { surah: 15, ayah: 1 }, { surah: 17, ayah: 1 },
    { surah: 18, ayah: 75 }, { surah: 21, ayah: 1 }, { surah: 23, ayah: 1 },
    { surah: 25, ayah: 21 }, { surah: 27, ayah: 56 }, { surah: 29, ayah: 46 },
    { surah: 33, ayah: 31 }, { surah: 36, ayah: 28 }, { surah: 39, ayah: 32 },
    { surah: 41, ayah: 47 }, { surah: 46, ayah: 1 }, { surah: 51, ayah: 31 },
    { surah: 58, ayah: 1 }, { surah: 67, ayah: 1 }, { surah: 78, ayah: 1 },
    { surah: 114, ayah: 1 },
  ];
  return JUZ_START.map((start, i) => ({
    number: i + 1,
    name: `Juz ${i + 1}`,
    nameAr: `جزء ${i + 1}`,
    startSurah: start.surah,
    startAyah: start.ayah,
  }));
};

const getPara = (number) => {
  loadData();
  const paras = getParas();
  const current = paras[number - 1];
  const next = paras[number] || null;
  if (!current) return { number, ayahs: [] };

  let inPara = false;
  const ayahs = quranData.filter((a) => {
    if (a.surahNumber === current.startSurah && a.ayahNumber >= current.startAyah) inPara = true;
    if (next && a.surahNumber === next.startSurah && a.ayahNumber >= next.startAyah) inPara = false;
    return inPara;
  });
  return { number, ayahs };
};

const getAyah = (surahNumber, ayahNumber) => {
  loadData();
  return quranData.find((a) => a.surahNumber === surahNumber && a.ayahNumber === ayahNumber);
};

const searchQuran = (query) => {
  loadData();
  const q = query.toLowerCase();
  return quranData.filter(
    (a) =>
      a.arabic.includes(query) ||
      a.translation?.toLowerCase().includes(q) ||
      a.transliteration?.toLowerCase().includes(q)
  );
};

const getTafseer = (surahNumber, ayahNumber) => {
  const tafseers = {
    '1:1': "Bismillah — In the name of Allah, the Most Gracious, the Most Merciful.",
    '1:2': "Alhamdulillah — All praise is due to Allah, Lord of all the worlds.",
    '2:255': "Ayat al-Kursi — The greatest verse in the Quran, describing Allah's sovereignty.",
  };
  const key = `${surahNumber}:${ayahNumber}`;
  return {
    surahNumber,
    ayahNumber,
    tafseer: tafseers[key] || 'Tafseer content will be available from authenticated scholars.',
    source: 'Ibn Kathir',
  };
};

const QARIS = [
  { id: 'abdul_basit', name: 'Abdul Basit Abdul Samad', nameAr: 'عبد الباسط عبد الصمد', style: 'Murattal' },
  { id: 'mishary', name: 'Mishary Rashid Alafasy', nameAr: 'مشاري راشد العفاسي', style: 'Murattal' },
  { id: 'sudais', name: 'Abdur-Rahman As-Sudais', nameAr: 'عبد الرحمن السديس', style: 'Murattal' },
  { id: 'ghamdi', name: 'Saad Al-Ghamdi', nameAr: 'سعد الغامدي', style: 'Murattal' },
];

const getQaris = () => QARIS;

const getAudioUrl = (qariId, surahNumber, ayahNumber) => {
  const paddedSurah = String(surahNumber).padStart(3, '0');
  const paddedAyah = String(ayahNumber).padStart(3, '0');
  return {
    url: `https://res.cloudinary.com/demo/video/upload/quran/${qariId}/${paddedSurah}${paddedAyah}.mp3`,
    qariId,
    surahNumber,
    ayahNumber,
  };
};

module.exports = {
  getSurahs,
  getSurah,
  getParas,
  getPara,
  getAyah,
  searchQuran,
  getTafseer,
  getQaris,
  getAudioUrl,
};
