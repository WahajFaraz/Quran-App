require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const connectDB = require('./src/config/database');
const errorMiddleware = require('./src/middleware/error.middleware');

const authRoutes = require('./src/routes/auth.routes');
const userRoutes = require('./src/routes/user.routes');
const quranRoutes = require('./src/routes/quran.routes');
const hifzRoutes = require('./src/routes/hifz.routes');
const qaRoutes = require('./src/routes/qa.routes');
const aalimRoutes = require('./src/routes/aalim.routes');
const hadithRoutes = require('./src/routes/hadith.routes');
const prayerRoutes = require('./src/routes/prayer.routes');
const adminRoutes = require('./src/routes/admin.routes');

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

app.use(helmet());
app.use(cors({ origin: true, credentials: true }));
app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: { success: false, error: { message: 'Too many requests' } },
});
app.use('/api/', limiter);

app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Quran App API is running', timestamp: new Date() });
});

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/quran', quranRoutes);
app.use('/api/v1/hifz', hifzRoutes);
app.use('/api/v1/qa', qaRoutes);
app.use('/api/v1/aalim', aalimRoutes);
app.use('/api/v1/hadith', hadithRoutes);
app.use('/api/v1/prayer', prayerRoutes);
app.use('/api/v1/admin', adminRoutes);

app.use(errorMiddleware);

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});

module.exports = app;
