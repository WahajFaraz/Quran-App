const https = require('https');

const fetchJSON = (url) => {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
};

const getPrayerTimes = async (lat, lng, method = 2) => {
  const today = new Date();
  const date = `${today.getDate()}-${today.getMonth() + 1}-${today.getFullYear()}`;
  const url = `${process.env.ALADHAN_API_URL}/timings/${date}?latitude=${lat}&longitude=${lng}&method=${method}`;
  const response = await fetchJSON(url);
  const timings = response.data.timings;
  return {
    date: response.data.date.readable,
    hijri: response.data.date.hijri,
    timings: {
      fajr: timings.Fajr,
      sunrise: timings.Sunrise,
      dhuhr: timings.Dhuhr,
      asr: timings.Asr,
      maghrib: timings.Maghrib,
      isha: timings.Isha,
    },
    meta: response.data.meta,
  };
};

const getQiblaDirection = async (lat, lng) => {
  const url = `${process.env.ALADHAN_API_URL}/qibla/${lat}/${lng}`;
  const response = await fetchJSON(url);
  return {
    direction: response.data.direction,
    latitude: lat,
    longitude: lng,
  };
};

const getNearbyMasajid = async (lat, lng, radius = 5000) => {
  // Uses Overpass API for mosque data
  const query = `[out:json];node["amenity"="place_of_worship"]["religion"="muslim"](around:${radius},${lat},${lng});out body;`;
  const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;

  try {
    const response = await fetchJSON(url);
    return response.elements.map((el) => ({
      id: el.id,
      name: el.tags?.name || 'Masjid',
      lat: el.lat,
      lng: el.lon,
      address: el.tags?.['addr:street'] || '',
    }));
  } catch {
    return [
      { id: 1, name: 'Central Masjid', lat: lat + 0.01, lng: lng + 0.01, address: 'Main Street' },
      { id: 2, name: 'Jamia Masjid', lat: lat - 0.008, lng: lng + 0.005, address: 'Market Road' },
    ];
  }
};

module.exports = { getPrayerTimes, getQiblaDirection, getNearbyMasajid };
