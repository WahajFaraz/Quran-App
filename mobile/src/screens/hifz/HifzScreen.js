import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Header, ScreenWrapper } from '../../components/layout/Header';
import Card, { SurahCard } from '../../components/common/Card';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import LoadingScreen from '../../components/common/LoadingScreen';
import { useHifzStore, useSettingsStore } from '../../store';
import { getTheme } from '../../theme';
import { borderRadius, spacing } from '../../theme/spacing';

const HifzDashboardScreen = ({ navigation }) => {
  const { dashboard, isLoading, fetchDashboard } = useHifzStore();
  const isDark = useSettingsStore((s) => s.darkMode);
  const theme = getTheme(isDark);

  useEffect(() => { fetchDashboard(); }, []);

  if (isLoading && !dashboard) return <LoadingScreen message="Loading Hifz data..." />;

  const stats = dashboard || {
    memorizedSurahs: 0,
    inProgressSurahs: 0,
    needsRevisionSurahs: 0,
    averageProgress: 0,
    todayAyahsReviewed: 0,
    dailyGoal: 5,
  };

  return (
    <ScreenWrapper>
      <Header title="Hifz Tracker" subtitle="Memorization Progress" onBack={() => navigation.goBack()} />
      <ScrollView style={styles.content}>
        <LinearGradient colors={theme.colors.gradient} style={styles.progressCard}>
          <Text style={styles.progressLabel}>Overall Progress</Text>
          <Text style={styles.progressValue}>{stats.averageProgress}%</Text>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${stats.averageProgress}%` }]} />
          </View>
          <Text style={styles.progressSub}>
            Today: {stats.todayAyahsReviewed}/{stats.dailyGoal} ayahs reviewed
          </Text>
        </LinearGradient>

        <View style={styles.statsRow}>
          {[
            { label: 'Memorized', value: stats.memorizedSurahs, icon: 'checkmark-circle', color: theme.colors.success },
            { label: 'In Progress', value: stats.inProgressSurahs, icon: 'time', color: theme.colors.warning },
            { label: 'Revision', value: stats.needsRevisionSurahs, icon: 'refresh', color: theme.colors.error },
          ].map((stat) => (
            <View key={stat.label} style={[styles.statCard, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
              <Ionicons name={stat.icon} size={24} color={stat.color} />
              <Text style={[styles.statValue, { color: theme.colors.text }]}>{stat.value}</Text>
              <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>{stat.label}</Text>
            </View>
          ))}
        </View>

        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Surah Progress</Text>
        {(stats.surahProgress || []).map((sp) => (
          <Card key={sp.surahNumber} onPress={() => navigation.navigate('SurahHifz', { surahNumber: sp.surahNumber })}>
            <View style={styles.surahProgressRow}>
              <Text style={[styles.surahNum, { color: theme.colors.primary }]}>#{sp.surahNumber}</Text>
              <View style={{ flex: 1 }}>
                <Text style={[styles.surahStatus, { color: theme.colors.text }]}>{sp.status.replace('_', ' ')}</Text>
                <View style={[styles.miniBar, { backgroundColor: theme.colors.border }]}>
                  <View style={[styles.miniFill, { width: `${sp.progressPercent}%`, backgroundColor: theme.colors.primary }]} />
                </View>
              </View>
              <Text style={{ color: theme.colors.textSecondary }}>{sp.progressPercent}%</Text>
            </View>
          </Card>
        ))}

        <Button title="Start New Surah" variant="outline" onPress={() => navigation.navigate('SurahList')} style={{ marginTop: spacing.md }} />
      </ScrollView>
    </ScreenWrapper>
  );
};

const SurahHifzScreen = ({ navigation, route }) => {
  const surahNumber = route.params?.surahNumber || 1;
  const { surahProgress, fetchSurahProgress, markMemorized, setHiddenForRevision, addMistakeNote } = useHifzStore();
  const [mistakeNote, setMistakeNote] = useState('');
  const [selectedAyah, setSelectedAyah] = useState(null);
  const isDark = useSettingsStore((s) => s.darkMode);
  const theme = getTheme(isDark);

  useEffect(() => { fetchSurahProgress(surahNumber); }, [surahNumber]);

  const handleMarkMemorized = async (ayahNumber) => {
    await markMemorized(surahNumber, [ayahNumber]);
    Alert.alert('Success', `Ayah ${ayahNumber} marked as memorized`);
  };

  const handleAddMistake = async () => {
    if (!selectedAyah || !mistakeNote.trim()) return;
    await addMistakeNote(surahNumber, selectedAyah, mistakeNote);
    setMistakeNote('');
    setSelectedAyah(null);
    Alert.alert('Saved', 'Mistake note added');
  };

  const startRevision = async () => {
    const memorized = surahProgress?.memorizedAyahs || [];
    await setHiddenForRevision(surahNumber, memorized);
    navigation.navigate('MushafReader', { surahNumber });
  };

  return (
    <ScreenWrapper>
      <Header title={`Surah ${surahNumber} Hifz`} onBack={() => navigation.goBack()} />
      <ScrollView style={styles.content}>
        <Card>
          <Text style={[styles.progressText, { color: theme.colors.text }]}>
            Progress: {surahProgress?.progressPercent || 0}%
          </Text>
          <Text style={{ color: theme.colors.textSecondary }}>
            Memorized: {(surahProgress?.memorizedAyahs || []).length} ayahs
          </Text>
        </Card>

        <Button title="Start Revision Mode" onPress={startRevision} style={{ marginVertical: spacing.md }} />

        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Mark Ayah Memorized</Text>
        <View style={styles.ayahGrid}>
          {Array.from({ length: 7 }, (_, i) => i + 1).map((num) => (
            <TouchableOpacity
              key={num}
              style={[
                styles.ayahBtn,
                {
                  backgroundColor: (surahProgress?.memorizedAyahs || []).includes(num)
                    ? theme.colors.primary
                    : theme.colors.surface,
                  borderColor: theme.colors.border,
                },
              ]}
              onPress={() => handleMarkMemorized(num)}
            >
              <Text style={{ color: (surahProgress?.memorizedAyahs || []).includes(num) ? '#FFF' : theme.colors.text }}>
                {num}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Mistake Notes</Text>
        {(surahProgress?.mistakeNotes || []).map((note, i) => (
          <Card key={i}>
            <Text style={{ color: theme.colors.primary, fontWeight: '600' }}>Ayah {note.ayahNumber}</Text>
            <Text style={{ color: theme.colors.textSecondary }}>{note.note}</Text>
          </Card>
        ))}

        <Input label="Ayah Number" value={selectedAyah ? String(selectedAyah) : ''} onChangeText={(v) => setSelectedAyah(parseInt(v) || null)} placeholder="Ayah number" keyboardType="numeric" />
        <Input label="Mistake Note" value={mistakeNote} onChangeText={setMistakeNote} placeholder="Describe the mistake..." multiline numberOfLines={3} />
        <Button title="Add Mistake Note" variant="outline" onPress={handleAddMistake} />
      </ScrollView>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  content: { padding: spacing.md },
  progressCard: { borderRadius: borderRadius.lg, padding: spacing.lg, marginBottom: spacing.lg },
  progressLabel: { color: 'rgba(255,255,255,0.8)', fontSize: 14 },
  progressValue: { color: '#FFF', fontSize: 48, fontWeight: '700' },
  progressBar: { height: 8, backgroundColor: 'rgba(255,255,255,0.3)', borderRadius: 4, marginVertical: spacing.sm },
  progressFill: { height: 8, borderRadius: 4, backgroundColor: '#D4AF37' },
  progressSub: { color: 'rgba(255,255,255,0.8)', fontSize: 13 },
  statsRow: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.lg },
  statCard: { flex: 1, alignItems: 'center', padding: spacing.md, borderRadius: borderRadius.md, borderWidth: 1 },
  statValue: { fontSize: 24, fontWeight: '700', marginTop: spacing.xs },
  statLabel: { fontSize: 11, marginTop: 2 },
  sectionTitle: { fontSize: 18, fontWeight: '700', marginBottom: spacing.md },
  surahProgressRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  surahNum: { fontSize: 18, fontWeight: '700' },
  surahStatus: { fontSize: 14, textTransform: 'capitalize' },
  miniBar: { height: 4, borderRadius: 2, marginTop: 4 },
  miniFill: { height: 4, borderRadius: 2 },
  progressText: { fontSize: 18, fontWeight: '600' },
  ayahGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginBottom: spacing.lg },
  ayahBtn: { width: 44, height: 44, borderRadius: borderRadius.full, justifyContent: 'center', alignItems: 'center', borderWidth: 1 },
});

export { SurahHifzScreen };
export default HifzDashboardScreen;
