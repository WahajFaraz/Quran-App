import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useSettingsStore } from '../../store';
import { getTheme } from '../../theme';
import { borderRadius, shadows, spacing } from '../../theme/spacing';

const Card = ({ children, onPress, style, padding = spacing.md }) => {
  const isDark = useSettingsStore((s) => s.darkMode);
  const theme = getTheme(isDark);

  const content = (
    <View
      style={[
        styles.card,
        shadows.sm,
        {
          backgroundColor: theme.colors.card,
          borderColor: theme.colors.border,
          padding,
        },
        style,
      ]}
    >
      {children}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        {content}
      </TouchableOpacity>
    );
  }

  return content;
};

export const SurahCard = ({ surah, onPress }) => {
  const isDark = useSettingsStore((s) => s.darkMode);
  const theme = getTheme(isDark);

  return (
    <Card onPress={onPress} style={styles.surahCard}>
      <View style={[styles.numberBadge, { backgroundColor: theme.colors.primary }]}>
        <Text style={styles.numberText}>{surah.number}</Text>
      </View>
      <View style={styles.surahInfo}>
        <Text style={[styles.surahName, { color: theme.colors.text }]}>{surah.name}</Text>
        <Text style={[styles.surahMeta, { color: theme.colors.textSecondary }]}>
          {surah.revelationType} · {surah.numberOfAyahs} Ayahs
        </Text>
      </View>
      <Text style={[styles.surahArabic, { color: theme.colors.textArabic }]}>
        {surah.nameAr}
      </Text>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: borderRadius.md,
    borderWidth: 1,
    marginBottom: spacing.sm,
  },
  surahCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  numberBadge: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
  },
  numberText: { color: '#FFF', fontWeight: '700', fontSize: 14 },
  surahInfo: { flex: 1 },
  surahName: { fontSize: 16, fontWeight: '600' },
  surahMeta: { fontSize: 12, marginTop: 2 },
  surahArabic: { fontSize: 20, fontWeight: '500' },
});

export default Card;
