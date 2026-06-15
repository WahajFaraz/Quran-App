require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/database');
const Category = require('../models/Category.model');
const Hadith = require('../models/Hadith.model');
const User = require('../models/User.model');

const categories = [
  { name: 'Aqeedah', nameAr: 'العقيدة', slug: 'aqeedah', icon: 'book', order: 1 },
  { name: 'Fiqh', nameAr: 'الفقه', slug: 'fiqh', icon: 'scale', order: 2 },
  { name: 'Hadith', nameAr: 'الحديث', slug: 'hadith', icon: 'document-text', order: 3 },
  { name: 'Quran', nameAr: 'القرآن', slug: 'quran', icon: 'book-open', order: 4 },
  { name: 'Family', nameAr: 'الأسرة', slug: 'family', icon: 'people', order: 5 },
  { name: 'Prayer', nameAr: 'الصلاة', slug: 'prayer', icon: 'time', order: 6 },
  { name: 'Ramadan', nameAr: 'رمضان', slug: 'ramadan', icon: 'moon', order: 7 },
  { name: 'General', nameAr: 'عام', slug: 'general', icon: 'help-circle', order: 8 },
];

const hadiths = [
  {
    collection: 'bukhari',
    bookNumber: 1,
    bookName: 'Revelation',
    bookNameAr: 'بدء الوحي',
    chapterNumber: 1,
    chapterName: 'How the Divine Revelation started',
    hadithNumber: 1,
    arabic: 'إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ',
    translation: 'Actions are judged by intentions, and every person will get what they intended.',
    narrator: 'Umar ibn Al-Khattab',
    grade: 'sahih',
    reference: 'Sahih al-Bukhari 1',
    tags: ['intentions', 'niyyah'],
  },
  {
    collection: 'bukhari',
    bookNumber: 1,
    bookName: 'Revelation',
    bookNameAr: 'بدء الوحي',
    chapterNumber: 1,
    chapterName: 'How the Divine Revelation started',
    hadithNumber: 2,
    arabic: 'بُنِيَ الإِسْلاَمُ عَلَى خَمْسٍ',
    translation: 'Islam is built upon five pillars: testifying that there is no god but Allah and Muhammad is His messenger, establishing prayer, paying zakat, fasting Ramadan, and pilgrimage to the House.',
    narrator: 'Abdullah ibn Umar',
    grade: 'sahih',
    reference: 'Sahih al-Bukhari 8',
    tags: ['pillars', 'islam'],
  },
  {
    collection: 'muslim',
    bookNumber: 1,
    bookName: 'Faith',
    bookNameAr: 'الإيمان',
    chapterNumber: 1,
    chapterName: 'Definition of Faith',
    hadithNumber: 1,
    arabic: 'لاَ يُؤْمِنُ أَحَدُكُمْ حَتَّى يُحِبَّ لأَخِيهِ مَا يُحِبُّ لِنَفْسِهِ',
    translation: 'None of you truly believes until he loves for his brother what he loves for himself.',
    narrator: 'Anas ibn Malik',
    grade: 'sahih',
    reference: 'Sahih Muslim 45',
    tags: ['faith', 'brotherhood'],
  },
  {
    collection: 'tirmidhi',
    bookNumber: 7,
    bookName: 'Virtues',
    bookNameAr: 'الفضائل',
    chapterNumber: 1,
    chapterName: 'Virtues of the Quran',
    hadithNumber: 1,
    arabic: 'خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ',
    translation: 'The best of you are those who learn the Quran and teach it.',
    narrator: 'Uthman ibn Affan',
    grade: 'sahih',
    reference: 'Jami at-Tirmidhi 2907',
    tags: ['quran', 'learning'],
  },
];

const seed = async () => {
  await connectDB();

  await Category.deleteMany({});
  await Category.insertMany(categories);
  console.log('Categories seeded');

  await Hadith.deleteMany({});
  await Hadith.insertMany(hadiths);
  console.log('Hadith seeded');

  const adminExists = await User.findOne({ email: 'admin@quranapp.com' });
  if (!adminExists) {
    await User.create({
      email: 'admin@quranapp.com',
      password: 'Admin@123',
      name: 'Admin',
      role: 'admin',
    });
    console.log('Admin user created: admin@quranapp.com / Admin@123');
  }

  console.log('Seed completed');
  process.exit(0);
};

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
