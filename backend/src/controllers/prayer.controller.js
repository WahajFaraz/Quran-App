const catchAsync = require('../utils/catchAsync');
const { sendSuccess } = require('../utils/response');
const prayerService = require('../services/prayer.service');
const ApiError = require('../utils/ApiError');

const getPrayerTimes = catchAsync(async (req, res) => {
  const { lat, lng, method } = req.query;
  if (!lat || !lng) throw new ApiError(400, 'Latitude and longitude required');
  const times = await prayerService.getPrayerTimes(parseFloat(lat), parseFloat(lng), method);
  sendSuccess(res, times);
});

const getQibla = catchAsync(async (req, res) => {
  const { lat, lng } = req.query;
  if (!lat || !lng) throw new ApiError(400, 'Latitude and longitude required');
  const qibla = await prayerService.getQiblaDirection(parseFloat(lat), parseFloat(lng));
  sendSuccess(res, qibla);
});

const getMasajid = catchAsync(async (req, res) => {
  const { lat, lng, radius } = req.query;
  if (!lat || !lng) throw new ApiError(400, 'Latitude and longitude required');
  const masajid = await prayerService.getNearbyMasajid(
    parseFloat(lat),
    parseFloat(lng),
    radius ? parseInt(radius) : 5000
  );
  sendSuccess(res, masajid);
});

module.exports = { getPrayerTimes, getQibla, getMasajid };
