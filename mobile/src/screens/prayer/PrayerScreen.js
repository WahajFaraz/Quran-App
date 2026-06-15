import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { LinearGradient } from 'expo-linear-gradient';
import { Header, ScreenWrapper } from '../../components/layout/Header';
import Card from '../../components/common/Card';
import LoadingScreen from '../../components/common/LoadingScreen';
import { prayerApi } from '../../api';
import { useSettingsStore } from '../../store';
import { getTheme } from '../../theme';
import { PRAYER_NAMES, PRAYER_LABELS } from '../../config/constants';
import { borderRadius, spacing } from '../../theme/spacing';

const PrayerTimesScreen = ({ navigation }) => {
  const [times, setTimes] = useState(null);
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [nextPrayer, setNextPrayer] = useState(null);
  const isDark = useSettingsStore((s) => s.darkMode);
  const theme = getTheme(isDark);

  useEffect(() => {
    loadPrayerTimes();
  }, []);

  const loadPrayerTimes = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission', 'Location permission is needed for prayer times');
        setLoading(false);
        return;
      }
      const loc = await Location.getCurrentPositionAsync({});
      setLocation(loc.coords);
      const res = await prayerApi.getTimes(loc.coords.latitude, loc.coords.longitude);
      setTimes(res.data);
      calculateNextPrayer(res.data.timings);
    } catch (error) {
      Alert.alert('Error', 'Could not load prayer times');
    } finally {
      setLoading(false);
    }
  };

  const calculateNextPrayer = (timings) => {
    const now = new Date();
    const prayerKeys = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];
    for (const key of prayerKeys) {
      const [h, m] = timings[key].split(':').map(Number);
      const prayerTime = new Date();
      prayerTime.setHours(h, m, 0);
      if (prayerTime > now) {
        const diff = prayerTime - now;
        const hours = Math.floor(diff / 3600000);
        const minutes = Math.floor((diff % 3600000) / 60000);
        setNextPrayer({ name: PRAYER_LABELS[key], time: timings[key], remaining: `${hours}h ${minutes}m` });
        break;
      }
    }
  };

  if (loading) return <LoadingScreen message="Getting prayer times..." />;

  return (
    <ScreenWrapper>
      <Header
        title="Prayer Times"
        subtitle={times?.date || ''}
        onBack={() => navigation.goBack()}
        rightAction={
          <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
            <Ionicons name="settings-outline" size={22} color="#FFF" />
          </TouchableOpacity>
        }
      />
      <ScrollView style={styles.content}>
        {nextPrayer && (
          <LinearGradient colors={theme.colors.gradient} style={styles.nextCard}>
            <Text style={styles.nextLabel}>Next Prayer</Text>
            <Text style={styles.nextName}>{nextPrayer.name}</Text>
            <Text style={styles.nextTime}>{nextPrayer.time}</Text>
            <Text style={styles.nextRemaining}>in {nextPrayer.remaining}</Text>
          </LinearGradient>
        )}

        {times?.hijri && (
          <Text style={[styles.hijri, { color: theme.colors.textSecondary }]}>
            {times.hijri.day} {times.hijri.month?.en} {times.hijri.year} AH
          </Text>
        )}

        {times && PRAYER_NAMES.filter((p) => p !== 'sunrise').map((prayer) => (
          <Card key={prayer} style={styles.prayerCard}>
            <View style={styles.prayerRow}>
              <View style={[styles.prayerIcon, { backgroundColor: theme.colors.primary + '15' }]}>
                <Ionicons
                  name={prayer === 'fajr' ? 'sunny-outline' : prayer === 'isha' ? 'moon-outline' : 'partly-sunny-outline'}
                  size={24}
                  color={theme.colors.primary}
                />
              </View>
              <Text style={[styles.prayerName, { color: theme.colors.text }]}>{PRAYER_LABELS[prayer]}</Text>
              <Text style={[styles.prayerTime, { color: theme.colors.primary }]}>{times.timings[prayer]}</Text>
            </View>
          </Card>
        ))}
      </ScrollView>
    </ScreenWrapper>
  );
};

const QiblaCompassScreen = ({ navigation }) => {
  const [qibla, setQibla] = useState(null);
  const [loading, setLoading] = useState(true);
  const isDark = useSettingsStore((s) => s.darkMode);
  const theme = getTheme(isDark);

  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === 'granted') {
          const loc = await Location.getCurrentPositionAsync({});
          const res = await prayerApi.getQibla(loc.coords.latitude, loc.coords.longitude);
          setQibla(res.data);
        }
      } catch (error) {
        Alert.alert('Error', 'Could not determine Qibla direction');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <LoadingScreen message="Finding Qibla..." />;

  return (
    <ScreenWrapper>
      <Header title="Qibla Compass" onBack={() => navigation.goBack()} />
      <View style={styles.compassContainer}>
        <View style={[styles.compass, { borderColor: theme.colors.primary }]}>
          <View
            style={[
              styles.compassNeedle,
              { transform: [{ rotate: `${qibla?.direction || 0}deg` }] },
            ]}
          >
            <Ionicons name="navigate" size={80} color={theme.colors.secondary} />
          </View>
          <Text style={[styles.compassLabel, { color: theme.colors.text }]}>Qibla</Text>
        </View>
        <Text style={[styles.directionText, { color: theme.colors.text }]}>
          {qibla?.direction?.toFixed(1)}° from North
        </Text>
        <Text style={[styles.kaabaText, { color: theme.colors.textSecondary }]}>
          Face this direction for prayer towards the Kaaba
        </Text>
      </View>
    </ScreenWrapper>
  );
};

const NearbyMasajidScreen = ({ navigation }) => {
  const [masajid, setMasajid] = useState([]);
  const [loading, setLoading] = useState(true);
  const isDark = useSettingsStore((s) => s.darkMode);
  const theme = getTheme(isDark);

  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === 'granted') {
          const loc = await Location.getCurrentPositionAsync({});
          const res = await prayerApi.getMasajid(loc.coords.latitude, loc.coords.longitude);
          setMasajid(res.data);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <LoadingScreen message="Finding masajid..." />;

  return (
    <ScreenWrapper>
      <Header title="Nearby Masajid" onBack={() => navigation.goBack()} />
      <ScrollView style={styles.content}>
        {masajid.map((masjid) => (
          <Card key={masjid.id}>
            <View style={styles.masjidRow}>
              <Ionicons name="location" size={24} color={theme.colors.primary} />
              <View style={{ flex: 1 }}>
                <Text style={[styles.masjidName, { color: theme.colors.text }]}>{masjid.name}</Text>
                <Text style={{ color: theme.colors.textSecondary, fontSize: 12 }}>{masjid.address}</Text>
              </View>
            </View>
          </Card>
        ))}
      </ScrollView>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  content: { padding: spacing.md },
  nextCard: { borderRadius: borderRadius.lg, padding: spacing.lg, alignItems: 'center', marginBottom: spacing.lg },
  nextLabel: { color: 'rgba(255,255,255,0.8)', fontSize: 13 },
  nextName: { color: '#FFF', fontSize: 32, fontWeight: '700', marginTop: spacing.xs },
  nextTime: { color: '#D4AF37', fontSize: 24, fontWeight: '600' },
  nextRemaining: { color: 'rgba(255,255,255,0.8)', fontSize: 14, marginTop: spacing.xs },
  hijri: { textAlign: 'center', marginBottom: spacing.md, fontSize: 14 },
  prayerCard: { marginBottom: spacing.sm },
  prayerRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  prayerIcon: { width: 44, height: 44, borderRadius: borderRadius.full, justifyContent: 'center', alignItems: 'center' },
  prayerName: { flex: 1, fontSize: 16, fontWeight: '600' },
  prayerTime: { fontSize: 18, fontWeight: '700' },
  compassContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: spacing.xl },
  compass: { width: 260, height: 260, borderRadius: 130, borderWidth: 3, justifyContent: 'center', alignItems: 'center' },
  compassNeedle: { position: 'absolute' },
  compassLabel: { position: 'absolute', bottom: 40, fontSize: 14, fontWeight: '600' },
  directionText: { fontSize: 24, fontWeight: '700', marginTop: spacing.xl },
  kaabaText: { fontSize: 14, marginTop: spacing.sm, textAlign: 'center' },
  masjidRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  masjidName: { fontSize: 16, fontWeight: '600' },
});

export { QiblaCompassScreen, NearbyMasajidScreen };
export default PrayerTimesScreen;
