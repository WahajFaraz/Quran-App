# Quran & Learning App — Architecture Document

## Overview

Production-grade Islamic mobile application with React Native (Expo) frontend, Node.js/Express backend, MongoDB, Firebase Auth, Cloudinary, and clean architecture.

---

## 1. Project Architecture

```
quran-app/
├── mobile/                          # React Native (Expo) app
│   ├── App.js
│   ├── app.json
│   ├── babel.config.js
│   ├── package.json
│   ├── src/
│   │   ├── api/                     # API client & endpoints
│   │   │   ├── client.js
│   │   │   ├── auth.api.js
│   │   │   ├── quran.api.js
│   │   │   ├── hifz.api.js
│   │   │   ├── qa.api.js
│   │   │   ├── hadith.api.js
│   │   │   ├── prayer.api.js
│   │   │   └── admin.api.js
│   │   ├── assets/
│   │   │   ├── fonts/
│   │   │   ├── images/
│   │   │   └── patterns/
│   │   ├── components/
│   │   │   ├── common/              # Button, Input, Card, Loader, EmptyState
│   │   │   ├── islamic/             # IslamicPattern, AyahCard, SurahHeader
│   │   │   ├── quran/               # MushafViewer, AyahControls
│   │   │   ├── prayer/              # QiblaCompass, PrayerCard
│   │   │   └── layout/              # ScreenWrapper, Header, TabBar
│   │   ├── config/
│   │   │   ├── firebase.js
│   │   │   ├── theme.js
│   │   │   └── constants.js
│   │   ├── hooks/
│   │   │   ├── useAuth.js
│   │   │   ├── useQuran.js
│   │   │   ├── usePrayerTimes.js
│   │   │   └── useOffline.js
│   │   ├── navigation/
│   │   │   ├── RootNavigator.js
│   │   │   ├── AuthNavigator.js
│   │   │   ├── MainTabNavigator.js
│   │   │   ├── QuranNavigator.js
│   │   │   ├── QANavigator.js
│   │   │   ├── AalimNavigator.js
│   │   │   └── AdminNavigator.js
│   │   ├── screens/
│   │   │   ├── auth/
│   │   │   ├── home/
│   │   │   ├── quran/
│   │   │   ├── hifz/
│   │   │   ├── qa/
│   │   │   ├── hadith/
│   │   │   ├── prayer/
│   │   │   ├── profile/
│   │   │   └── admin/
│   │   ├── services/
│   │   │   ├── storage.service.js   # AsyncStorage / SQLite offline
│   │   │   ├── audio.service.js
│   │   │   ├── location.service.js
│   │   │   └── notification.service.js
│   │   ├── store/                   # Zustand state management
│   │   │   ├── authStore.js
│   │   │   ├── quranStore.js
│   │   │   ├── hifzStore.js
│   │   │   ├── settingsStore.js
│   │   │   └── index.js
│   │   ├── theme/
│   │   │   ├── colors.js
│   │   │   ├── typography.js
│   │   │   ├── spacing.js
│   │   │   └── index.js
│   │   └── utils/
│   │       ├── validators.js
│   │       ├── formatters.js
│   │       └── quranHelpers.js
│   └── data/                        # Bundled offline Quran JSON
│       └── quran-sample.json
│
├── backend/                         # Node.js + Express API
│   ├── package.json
│   ├── server.js
│   ├── .env.example
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.js
│   │   │   ├── firebase.js
│   │   │   └── cloudinary.js
│   │   ├── middleware/
│   │   │   ├── auth.middleware.js
│   │   │   ├── role.middleware.js
│   │   │   ├── validate.middleware.js
│   │   │   └── error.middleware.js
│   │   ├── models/
│   │   │   ├── User.model.js
│   │   │   ├── Aalim.model.js
│   │   │   ├── Question.model.js
│   │   │   ├── Answer.model.js
│   │   │   ├── Bookmark.model.js
│   │   │   ├── HifzProgress.model.js
│   │   │   ├── ReadingHistory.model.js
│   │   │   ├── Hadith.model.js
│   │   │   ├── Category.model.js
│   │   │   └── Report.model.js
│   │   ├── routes/
│   │   │   ├── auth.routes.js
│   │   │   ├── quran.routes.js
│   │   │   ├── hifz.routes.js
│   │   │   ├── qa.routes.js
│   │   │   ├── hadith.routes.js
│   │   │   ├── prayer.routes.js
│   │   │   ├── user.routes.js
│   │   │   └── admin.routes.js
│   │   ├── controllers/
│   │   │   ├── auth.controller.js
│   │   │   ├── quran.controller.js
│   │   │   ├── hifz.controller.js
│   │   │   ├── qa.controller.js
│   │   │   ├── hadith.controller.js
│   │   │   ├── prayer.controller.js
│   │   │   ├── user.controller.js
│   │   │   └── admin.controller.js
│   │   ├── services/
│   │   │   ├── auth.service.js
│   │   │   ├── quran.service.js
│   │   │   ├── notification.service.js
│   │   │   └── prayer.service.js
│   │   ├── utils/
│   │   │   ├── ApiError.js
│   │   │   ├── catchAsync.js
│   │   │   └── response.js
│   │   └── seed/
│   │       ├── seedSurahs.js
│   │       └── seedHadith.js
│   └── data/
│       ├── surahs.json
│       └── hadith-sample.json
│
└── docs/
    ├── API.md
    ├── DATABASE.md
    └── SCREENS.md
```

### Clean Architecture Layers

| Layer | Responsibility |
|-------|----------------|
| **Presentation** | Screens, Components, Navigation |
| **State** | Zustand stores, hooks |
| **Domain** | Business logic in services/utils |
| **Data** | API client, local storage, offline cache |
| **Infrastructure** | Firebase, Cloudinary, MongoDB via backend |

---

## 2. Database Schema (MongoDB)

### users
```javascript
{
  _id: ObjectId,
  firebaseUid: String (unique, indexed),
  email: String (unique),
  name: String,
  avatar: String (Cloudinary URL),
  role: Enum ['user', 'aalim', 'admin'],
  language: String (default: 'en'),
  darkMode: Boolean,
  fcmToken: String,
  lastReading: {
    surahNumber: Number,
    ayahNumber: Number,
    paraNumber: Number,
    pageNumber: Number,
    updatedAt: Date
  },
  preferences: {
    mushafLayout: Enum ['15', '16', '17', '21'],
    qariId: String,
    showTranslation: Boolean,
    showTafseer: Boolean,
    fontSize: Number
  },
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### aalims
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: users),
  fullName: String,
  qualifications: String,
  specialization: [String],
  sanadCertificate: String (Cloudinary URL),
  degreeCertificate: String (Cloudinary URL),
  bio: String,
  verificationStatus: Enum ['pending', 'verified', 'rejected'],
  verifiedBy: ObjectId (ref: users),
  verifiedAt: Date,
  rejectionReason: String,
  answeredCount: Number,
  rating: Number,
  createdAt: Date
}
```

### categories
```javascript
{
  _id: ObjectId,
  name: String,
  nameAr: String,
  slug: String (unique),
  icon: String,
  order: Number,
  isActive: Boolean
}
```

### questions
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: users),
  categoryId: ObjectId (ref: categories),
  title: String,
  body: String,
  status: Enum ['open', 'answered', 'closed'],
  isAnonymous: Boolean,
  viewCount: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### answers
```javascript
{
  _id: ObjectId,
  questionId: ObjectId (ref: questions),
  aalimId: ObjectId (ref: aalims),
  body: String,
  references: [String],
  isAccepted: Boolean,
  helpfulCount: Number,
  createdAt: Date
}
```

### bookmarks
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: users),
  type: Enum ['ayah', 'hadith', 'surah'],
  surahNumber: Number,
  ayahNumber: Number,
  hadithId: ObjectId,
  note: String,
  createdAt: Date
}
// Index: { userId: 1, type: 1, surahNumber: 1, ayahNumber: 1 }
```

### hifz_progress
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: users),
  surahNumber: Number,
  status: Enum ['not_started', 'memorizing', 'memorized', 'needs_revision'],
  memorizedAyahs: [Number],
  hiddenAyahs: [Number],        // for revision mode
  mistakeNotes: [{
    ayahNumber: Number,
    note: String,
    createdAt: Date
  }],
  dailyGoal: Number (ayahs per day),
  revisionSchedule: [{
    date: Date,
    ayahsReviewed: Number,
    completed: Boolean
  }],
  progressPercent: Number,
  lastRevisedAt: Date,
  createdAt: Date
}
// Index: { userId: 1, surahNumber: 1 } unique
```

### reading_history
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: users),
  surahNumber: Number,
  ayahNumber: Number,
  paraNumber: Number,
  duration: Number (seconds),
  readAt: Date
}
```

### hadiths
```javascript
{
  _id: ObjectId,
  collection: String,           // e.g. 'bukhari', 'muslim'
  bookNumber: Number,
  bookName: String,
  bookNameAr: String,
  chapterNumber: Number,
  chapterName: String,
  hadithNumber: Number,
  arabic: String,
  translation: String,
  narrator: String,
  grade: String,                // sahih, hasan, etc.
  reference: String,
  tags: [String]
}
// Indexes: collection+hadithNumber, text search on arabic+translation
```

### reports
```javascript
{
  _id: ObjectId,
  reporterId: ObjectId (ref: users),
  targetType: Enum ['question', 'answer', 'user'],
  targetId: ObjectId,
  reason: String,
  description: String,
  status: Enum ['pending', 'resolved', 'dismissed'],
  resolvedBy: ObjectId,
  createdAt: Date
}
```

### qaris (audio reciters)
```javascript
{
  _id: ObjectId,
  name: String,
  nameAr: String,
  style: String,
  cloudinaryBasePath: String,
  isActive: Boolean
}
```

### notifications_log
```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  type: String,
  title: String,
  body: String,
  data: Object,
  read: Boolean,
  sentAt: Date
}
```

---

## 3. UI Screens List

### Auth Flow
| Screen | Description |
|--------|-------------|
| SplashScreen | Islamic pattern splash with app logo |
| OnboardingScreen | 3-slide feature intro |
| LoginScreen | Email/password + Google via Firebase |
| RegisterScreen | User registration |
| ForgotPasswordScreen | Password reset |
| AalimLoginScreen | Separate Aalim portal login |
| AalimRegisterScreen | Aalim profile + certificate upload |

### Main Tabs
| Tab | Screens |
|-----|---------|
| **Home** | HomeScreen, DailyAyahScreen, QuickActions |
| **Quran** | SurahList, ParaList, MushafReader, AyahDetail, Search, Bookmarks, Tafseer |
| **Learn** | HadithHome, HadithBookList, HadithChapter, HadithDetail, HadithSearch |
| **Prayer** | PrayerTimes, QiblaCompass, NearbyMasajid |
| **More** | Profile, Settings, HifzDashboard, QAHome, Notifications |

### Quran Module Screens
- SurahListScreen — 114 surahs with search/filter
- ParaListScreen — 30 paras (Juz)
- MushafReaderScreen — Ayah-wise reading with layout selector
- HifzModeScreen — Hide/show ayahs, memorization UI
- QuranSearchScreen — Full-text search
- BookmarkListScreen — Saved ayahs
- TafseerScreen — Authentic tafseer per ayah
- AudioPlayerScreen — Qari selection, repeat ayah
- TranslationSettingsScreen — Translation toggle & language

### Hifz Module Screens
- HifzDashboardScreen — Overall progress, daily goals
- SurahHifzScreen — Per-surah memorization tracker
- RevisionScreen — Scheduled revision with hidden ayahs
- MistakeNotesScreen — Error tracking per ayah

### Q&A Module Screens
- QAHomeScreen — Browse categories & recent questions
- AskQuestionScreen — Submit question with category
- QuestionDetailScreen — View answers
- MyQuestionsScreen — User's question history
- AalimDashboardScreen — Pending questions for Aalim
- AnswerQuestionScreen — Aalim answer form
- AalimProfileScreen — Public Aalim profile

### Hadith Module Screens
- HadithHomeScreen — Collection cards (Bukhari, Muslim, etc.)
- HadithBookListScreen — Books within collection
- HadithChapterScreen — Chapters in a book
- HadithDetailScreen — Full hadith with reference
- HadithSearchScreen — Search across collections

### Prayer Module Screens
- PrayerTimesScreen — Today's timings with countdown
- QiblaCompassScreen — Compass pointing to Kaaba
- NearbyMasajidScreen — Map with masjid markers
- PrayerSettingsScreen — Calculation method, notifications

### Profile & Settings
- ProfileScreen — User info, stats
- EditProfileScreen — Update name, avatar
- SettingsScreen — Dark mode, language, notifications
- FavoritesScreen — Combined favorites
- ReadingHistoryScreen — Past reading sessions
- NotificationsScreen — In-app notification list

### Admin Screens
- AdminDashboardScreen — Stats overview
- UserManagementScreen — List/block users
- AalimVerificationScreen — Approve/reject Aalims
- CategoryManagementScreen — CRUD categories
- ContentManagementScreen — Manage Quran/Hadith content
- ReportsManagementScreen — Handle user reports

---

## 4. Navigation Structure

```
RootNavigator
├── AuthNavigator (unauthenticated)
│   ├── Splash
│   ├── Onboarding
│   ├── Login
│   ├── Register
│   ├── ForgotPassword
│   ├── AalimLogin
│   └── AalimRegister
│
├── MainTabNavigator (authenticated user)
│   ├── HomeStack
│   │   ├── Home
│   │   └── DailyAyah
│   ├── QuranStack
│   │   ├── SurahList
│   │   ├── ParaList
│   │   ├── MushafReader
│   │   ├── HifzMode
│   │   ├── QuranSearch
│   │   ├── Bookmarks
│   │   ├── Tafseer
│   │   └── AudioPlayer
│   ├── LearnStack (Hadith)
│   │   ├── HadithHome
│   │   ├── HadithBooks
│   │   ├── HadithChapters
│   │   ├── HadithDetail
│   │   └── HadithSearch
│   ├── PrayerStack
│   │   ├── PrayerTimes
│   │   ├── QiblaCompass
│   │   ├── NearbyMasajid
│   │   └── PrayerSettings
│   └── MoreStack
│       ├── MoreMenu
│       ├── Profile
│       ├── Settings
│       ├── HifzDashboard → SurahHifz → Revision → MistakeNotes
│       ├── QAHome → AskQuestion → QuestionDetail → MyQuestions
│       ├── Favorites
│       ├── ReadingHistory
│       └── Notifications
│
├── AalimNavigator (authenticated aalim)
│   ├── AalimDashboard
│   ├── AnswerQuestion
│   ├── AalimProfile
│   └── AalimSettings
│
└── AdminNavigator (authenticated admin)
    ├── AdminDashboard
    ├── UserManagement
    ├── AalimVerification
    ├── CategoryManagement
    ├── ContentManagement
    └── ReportsManagement
```

---

## 5. Backend API Design

Base URL: `https://api.quranapp.com/v1`

### Auth (`/auth`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Register user (syncs Firebase token) |
| POST | `/auth/login` | Login, returns JWT + user profile |
| POST | `/auth/aalim/register` | Aalim registration with certificates |
| POST | `/auth/aalim/login` | Aalim-specific login |
| POST | `/auth/refresh` | Refresh access token |
| POST | `/auth/forgot-password` | Trigger password reset |
| DELETE | `/auth/account` | Delete account |

### Users (`/users`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/users/me` | Get current user profile |
| PATCH | `/users/me` | Update profile |
| PATCH | `/users/me/preferences` | Update Quran/prayer preferences |
| POST | `/users/me/avatar` | Upload avatar (Cloudinary) |
| POST | `/users/me/fcm-token` | Register FCM token |
| GET | `/users/me/reading-history` | Get reading history |
| GET | `/users/me/notifications` | Get notifications |

### Quran (`/quran`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/quran/surahs` | List all 114 surahs |
| GET | `/quran/surahs/:number` | Get surah with ayahs |
| GET | `/quran/paras` | List 30 paras |
| GET | `/quran/paras/:number` | Get para content |
| GET | `/quran/ayahs/:surah/:ayah` | Single ayah with translation |
| GET | `/quran/search?q=` | Search Quran text |
| GET | `/quran/tafseer/:surah/:ayah` | Get tafseer for ayah |
| GET | `/quran/qaris` | List audio reciters |
| GET | `/quran/audio/:qari/:surah/:ayah` | Get audio URL |
| POST | `/quran/bookmarks` | Create bookmark |
| GET | `/quran/bookmarks` | List user bookmarks |
| DELETE | `/quran/bookmarks/:id` | Remove bookmark |
| PATCH | `/quran/last-reading` | Save last reading position |

### Hifz (`/hifz`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/hifz/progress` | Get all surah progress |
| GET | `/hifz/progress/:surah` | Get surah-specific progress |
| POST | `/hifz/progress` | Initialize/update progress |
| PATCH | `/hifz/progress/:surah/ayahs` | Mark ayahs memorized |
| PATCH | `/hifz/progress/:surah/hidden` | Set hidden ayahs for revision |
| POST | `/hifz/progress/:surah/mistakes` | Add mistake note |
| GET | `/hifz/dashboard` | Dashboard stats (%, goals) |
| PATCH | `/hifz/daily-goal` | Set daily revision goal |

### Q&A (`/qa`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/qa/categories` | List question categories |
| GET | `/qa/questions` | List questions (paginated, filterable) |
| POST | `/qa/questions` | Ask a question |
| GET | `/qa/questions/:id` | Get question with answers |
| GET | `/qa/questions/my` | User's own questions |
| POST | `/qa/questions/:id/answers` | Aalim posts answer |
| PATCH | `/qa/answers/:id/accept` | Mark answer as accepted |
| POST | `/qa/answers/:id/helpful` | Mark answer helpful |

### Aalim (`/aalim`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/aalim/profile` | Get own Aalim profile |
| PATCH | `/aalim/profile` | Update Aalim profile |
| POST | `/aalim/certificates` | Upload sanad/degree |
| GET | `/aalim/questions/pending` | Pending questions to answer |
| GET | `/aalim/questions/answered` | Answered questions history |
| GET | `/aalim/:id` | Public Aalim profile |

### Hadith (`/hadith`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/hadith/collections` | List collections |
| GET | `/hadith/:collection/books` | Books in collection |
| GET | `/hadith/:collection/books/:book/chapters` | Chapters |
| GET | `/hadith/:collection/:number` | Single hadith |
| GET | `/hadith/search?q=` | Search hadith |
| GET | `/hadith/chapter/:collection/:book/:chapter` | Hadiths in chapter |

### Prayer (`/prayer`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/prayer/times?lat=&lng=&method=` | Prayer times for location |
| GET | `/prayer/qibla?lat=&lng=` | Qibla direction |
| GET | `/prayer/masajid?lat=&lng=&radius=` | Nearby masajid |

### Admin (`/admin`) — requires admin role
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/admin/dashboard` | Stats overview |
| GET | `/admin/users` | List users |
| PATCH | `/admin/users/:id` | Block/unblock user |
| GET | `/admin/aalims/pending` | Pending verifications |
| PATCH | `/admin/aalims/:id/verify` | Approve Aalim |
| PATCH | `/admin/aalims/:id/reject` | Reject with reason |
| CRUD | `/admin/categories` | Manage categories |
| GET | `/admin/reports` | List reports |
| PATCH | `/admin/reports/:id` | Resolve report |
| POST | `/admin/content/hadith` | Bulk upload hadith |
| POST | `/admin/notifications/broadcast` | Send push to all |

### Standard Response Format
```json
{
  "success": true,
  "data": {},
  "message": "Optional message",
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Email is required",
    "details": []
  }
}
```

---

## 6. Tech Decisions

| Concern | Choice | Rationale |
|---------|--------|-----------|
| RN Framework | Expo SDK 52 | Faster dev, OTA updates, built-in modules |
| State | Zustand | Lightweight, no boilerplate |
| Navigation | React Navigation 6 | Industry standard |
| API Client | Axios + interceptors | Token refresh, error handling |
| Offline Quran | Bundled JSON + SQLite cache | Full offline reading |
| Audio | expo-av + Cloudinary CDN | Streaming + download |
| Location | expo-location | Prayer times, Qibla |
| Maps | react-native-maps | Masajid finder |
| Animations | react-native-reanimated | Smooth 60fps animations |
| Fonts | Amiri (Arabic), Playfair (headings) | Classical Islamic typography |

---

## 7. Implementation Phases

1. **Phase 1** — Project scaffold, theme, navigation, auth
2. **Phase 2** — Quran module (reader, search, bookmarks, audio)
3. **Phase 3** — Hifz management
4. **Phase 4** — Q&A system (user + Aalim)
5. **Phase 5** — Hadith module
6. **Phase 6** — Prayer features
7. **Phase 7** — Profile, settings, notifications
8. **Phase 8** — Admin dashboard
