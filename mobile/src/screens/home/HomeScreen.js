import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Header, ScreenWrapper } from '../../components/layout/Header';
import Card from '../../components/common/Card';
import { useAuthStore, useSettingsStore } from '../../store';
import { getTheme } from '../../theme';
import { borderRadius, spacing } from '../../theme/spacing';

const QUICK_ACTIONS = [
  { icon: 'book', label: 'Continue Reading', screen: 'MushafReader', color: '#1B4332' },
  { icon: 'search', label: 'Search Quran', screen: 'QuranSearch', color: '#2D6A4F' },
  { icon: 'school', label: 'Hifz Tracker', screen: 'HifzDashboard', color: '#40916C' },
  { icon: 'help-circle', label: 'Ask Question', screen: 'QAHome', color: '#D4AF37' },
  { icon: 'time', label: 'Prayer Times', screen: 'PrayerTimes', color: '#1B4332' },
  { icon: 'compass', label: 'Qibla', screen: 'QiblaCompass', color: '#2D6A4F' },
];

const HomeScreen = ({ navigation }) => {
  const user = useAuthStore((s) => s.user);
  const isDark = useSettingsStore((s) => s.darkMode);
  const theme = getTheme(isDark);

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Assalamu Alaikum';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <ScreenWrapper>
      <Header
        title={greeting()}
        subtitle={user?.name || 'Guest'}
        rightAction={
          <TouchableOpacity onPress={() => navigation.navigate('Notifications')}>
            <Ionicons name="notifications-outline" size={24} color="#FFF" />
          </TouchableOpacity>
        }
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <LinearGradient
          colors={theme.colors.gradientGold}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.dailyCard}
        >
          <Text style={styles.dailyLabel}>Ayah of the Day</Text>
          <Text style={styles.dailyArabic}>إِنَّ مَعَ الْعُسْرِ يُسْرًا</Text>
          <Text style={styles.dailyTranslation}>
            "Indeed, with hardship comes ease." — Ash-Sharh 94:6
          </Text>
        </LinearGradient>

        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Quick Actions</Text>
        <View style={styles.actionsGrid}>
          {QUICK_ACTIONS.map((action) => (
            <TouchableOpacity
              key={action.label}
              style={[styles.actionCard, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}
              onPress={() => navigation.navigate(action.screen)}
            >
              <View style={[styles.actionIcon, { backgroundColor: action.color + '20' }]}>
                <Ionicons name={action.icon} size={24} color={action.color} />
              </View>
              <Text style={[styles.actionLabel, { color: theme.colors.text }]}>{action.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Continue Learning</Text>
        <Card onPress={() => navigation.navigate('SurahList')}>
          <View style={styles.continueRow}>
            <Ionicons name="book-outline" size={32} color={theme.colors.primary} />
            <View style={styles.continueInfo}>
              <Text style={[styles.continueTitle, { color: theme.colors.text }]}>Quran Reading</Text>
              <Text style={[styles.continueSub, { color: theme.colors.textSecondary }]}>
                Last read: Surah {user?.lastReading?.surahNumber || 1}, Ayah {user?.lastReading?.ayahNumber || 1}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.colors.textSecondary} />
          </View>
        </Card>

        <Card onPress={() => navigation.navigate('HadithHome')}>
          <View style={styles.continueRow}>
            <Ionicons name="library-outline" size={32} color={theme.colors.secondary} />
            <View style={styles.continueInfo}>
              <Text style={[styles.continueTitle, { color: theme.colors.text }]}>Hadith Collections</Text>
              <Text style={[styles.continueSub, { color: theme.colors.textSecondary }]}>
                Bukhari, Muslim, Tirmidhi & more
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.colors.textSecondary} />
          </View>
        </Card>
      </ScrollView>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  content: { flex: 1, padding: spacing.md },
  dailyCard: { borderRadius: borderRadius.lg, padding: spacing.lg, marginBottom: spacing.lg },
  dailyLabel: { fontSize: 12, color: 'rgba(0,0,0,0.6)', fontWeight: '600', textTransform: 'uppercase' },
  dailyArabic: { fontSize: 28, color: '#1B4332', textAlign: 'center', marginVertical: spacing.md, fontWeight: '600' },
  dailyTranslation: { fontSize: 14, color: 'rgba(0,0,0,0.7)', textAlign: 'center', fontStyle: 'italic' },
  sectionTitle: { fontSize: 18, fontWeight: '700', marginBottom: spacing.md, marginTop: spacing.sm },
  actionsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginBottom: spacing.lg },
  actionCard: {
    width: '31%',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
  },
  actionIcon: { width: 48, height: 48, borderRadius: borderRadius.full, justifyContent: 'center', alignItems: 'center', marginBottom: spacing.xs },
  actionLabel: { fontSize: 11, fontWeight: '600', textAlign: 'center' },
  continueRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  continueInfo: { flex: 1 },
  continueTitle: { fontSize: 16, fontWeight: '600' },
  continueSub: { fontSize: 12, marginTop: 2 },
});

export default HomeScreen;
