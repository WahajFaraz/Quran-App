const express = require('express');
const { getPrayerTimes, getQibla, getMasajid } = require('../controllers/prayer.controller');

const router = express.Router();

router.get('/times', getPrayerTimes);
router.get('/qibla', getQibla);
router.get('/masajid', getMasajid);

module.exports = router;
