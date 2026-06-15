# Quran & Learning App

A production-grade Islamic mobile application with React Native and Node.js backend.

## Project Structure

```
Quran App/
├── ARCHITECTURE.md     # Full architecture, DB schema, API design
├── backend/            # Node.js + Express + MongoDB API
└── mobile/             # React Native (Expo) app
```

## Quick Start

### Backend

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your MongoDB URI and secrets
npm run seed    # Seed categories, hadith, admin user
npm run dev     # Start on port 5000
```

**Default Admin:** `admin@quranapp.com` / `Admin@123`

### Mobile

```bash
cd mobile
npm install
npx expo start
```

For Android emulator, API points to `http://10.0.2.2:5000`. For physical device, update `API_BASE_URL` in `src/config/constants.js` to your machine's IP.

## Features Implemented

- **Quran Module** — Surah/Para navigation, Mushaf reader, 4 line layouts, Hifz mode, search, bookmarks, audio, tafseer
- **Hifz Management** — Progress tracking, daily goals, mistake notes, revision mode
- **Islamic Q&A** — User questions, Aalim answers, category system, verification
- **Hadith Module** — 6 collections, book/chapter browsing, search
- **Prayer Features** — Prayer times (Aladhan API), Qibla compass, nearby masajid
- **User Features** — Profile, settings, dark mode, language, bookmarks
- **Admin Dashboard** — User management, Aalim verification, reports

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Mobile | React Native (Expo 52), Zustand, React Navigation 6 |
| Backend | Node.js, Express, MongoDB (Mongoose) |
| Auth | JWT + Firebase Admin SDK |
| Storage | Cloudinary (audio/images) |
| Prayer API | Aladhan API |

## Environment Variables

See `backend/.env.example` for all required variables including MongoDB, JWT, Firebase, and Cloudinary credentials.

## API Documentation

Full API reference is in `ARCHITECTURE.md` Section 5. Base URL: `/api/v1`

## Notes

- Quran data includes sample surahs (1, 2, 112-114). For production, import the full Quran dataset into `backend/data/quran-full.json`.
- Firebase and Cloudinary require valid credentials for auth and file uploads.
- Add app icons to `mobile/assets/` (icon.png, splash.png, adaptive-icon.png).
