const express = require('express');
const {
  getMe, updateMe, updatePreferences, updateFcmToken,
  getReadingHistory, getNotifications, markNotificationRead,
} = require('../controllers/user.controller');
const { protect } = require('../middleware/auth.middleware');

const router = express.Router();
router.use(protect);

router.get('/me', getMe);
router.patch('/me', updateMe);
router.patch('/me/preferences', updatePreferences);
router.post('/me/fcm-token', updateFcmToken);
router.get('/me/reading-history', getReadingHistory);
router.get('/me/notifications', getNotifications);
router.patch('/me/notifications/:id/read', markNotificationRead);

module.exports = router;
