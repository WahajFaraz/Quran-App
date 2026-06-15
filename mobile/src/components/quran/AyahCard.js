import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSettingsStore } from '../../store';
import { getTheme } from '../../theme';
import { borderRadius, spacing } from '../../theme/spacing';

const AyahCard = ({
  ayah,
  surahNumber,
  isHighlighted = false,
  isHidden = false,
  showTranslation = true,
  fontSize = 24,
  onPress,
  onBookmark,
  onPlay,
  isBookmarked = false,
}) => {
  const isDark = useSettingsStore((s) => s.darkMode);
  const theme = getTheme(isDark);

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={[
        styles.container,
        {
          backgroundColor: isHighlighted
            ? isDark ? 'rgba(212,175,55,0.15)' : 'rgba(212,175,55,0.1)'
            : theme.colors.card,
          borderColor: isHighlighted ? theme.colors.secondary : theme.colors.border,
        },
      ]}
    >
      <View style={styles.header}>
        <View style={[styles.ayahBadge, { backgroundColor: theme.colors.primary }]}>
          <Text style={styles.ayahNumber}>
            {surahNumber}:{ayah.ayahNumber}
          </Text>
        </View>
        <View style={styles.actions}>
          {onPlay && (
            <TouchableOpacity onPress={onPlay} style={styles.actionBtn}>
              <Ionicons name="play-circle" size={28} color={theme.colors.primary} />
            </TouchableOpacity>
          )}
          {onBookmark && (
            <TouchableOpacity onPress={onBookmark} style={styles.actionBtn}>
              <Ionicons
                name={isBookmarked ? 'bookmark' : 'bookmark-outline'}
                size={24}
                color={isBookmarked ? theme.colors.secondary : theme.colors.textSecondary}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {isHidden ? (
        <View style={[styles.hiddenBox, { borderColor: theme.colors.border }]}>
          <Ionicons name="eye-off" size={24} color={theme.colors.textSecondary} />
          <Text style={[styles.hiddenText, { color: theme.colors.textSecondary }]}>
            Tap to reveal ayah
          </Text>
        </View>
      ) : (
        <>
          <Text
            style={[
              styles.arabic,
              {
                color: theme.colors.textArabic,
                fontSize: fontSize,
                lineHeight: fontSize * 1.8,
              },
            ]}
          >
            {ayah.arabic}
          </Text>
          {showTranslation && ayah.translation && (
            <Text style={[styles.translation, { color: theme.colors.textSecondary }]}>
              {ayah.translation}
            </Text>
          )}
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    marginBottom: spacing.sm,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  ayahBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  ayahNumber: { color: '#FFF', fontSize: 12, fontWeight: '600' },
  actions: { flexDirection: 'row', gap: spacing.xs },
  actionBtn: { padding: spacing.xs },
  arabic: {
    textAlign: 'right',
    writingDirection: 'rtl',
    fontWeight: '500',
  },
  translation: {
    fontSize: 14,
    lineHeight: 22,
    marginTop: spacing.sm,
    fontStyle: 'italic',
  },
  hiddenBox: {
    height: 80,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderRadius: borderRadius.sm,
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.xs,
  },
  hiddenText: { fontSize: 13 },
});

export default AyahCard;
