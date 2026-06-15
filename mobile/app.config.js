module.exports = {
  expo: {
    name: 'Quran & Learning',
    slug: 'quran-learning-app-local-dev',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/icon.png',
    userInterfaceStyle: 'automatic',
    updates: { enabled: false, checkAutomatically: 'NEVER', fallbackToCacheTimeout: 0 },
    splash: {
      image: './assets/splash.png',
      resizeMode: 'contain',
      backgroundColor: '#1B4332',
    },
    assetBundlePatterns: ['**/*'],
    ios: {
      supportsTablet: true,
      bundleIdentifier: 'com.quranapp.learning',
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/adaptive-icon.png',
        backgroundColor: '#1B4332',
      },
      package: 'com.quranapp.learning',
      usesCleartextTraffic: true,
      permissions: [
        'ACCESS_FINE_LOCATION',
        'ACCESS_COARSE_LOCATION',
        'RECEIVE_BOOT_COMPLETED',
        'VIBRATE',
      ],
    },
    plugins: [
      'expo-font',
      [
        'expo-location',
        {
          locationAlwaysAndWhenInUsePermission:
            'Allow Quran App to use your location for prayer times and Qibla direction.',
        },
      ],
    ],
  },
};
