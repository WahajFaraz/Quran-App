import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSettingsStore } from '../../store';
import { getTheme } from '../../theme';
import { spacing } from '../../theme/spacing';

const LoadingScreen = ({ message = 'Loading...' }) => {
  const isDark = useSettingsStore((s) => s.darkMode);
  const theme = getTheme(isDark);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ActivityIndicator size="large" color={theme.colors.primary} />
      <Text style={[styles.text, { color: theme.colors.textSecondary }]}>{message}</Text>
    </View>
  );
};

export const EmptyState = ({ icon = 'document-outline', title, message, action }) => {
  const isDark = useSettingsStore((s) => s.darkMode);
  const theme = getTheme(isDark);

  return (
    <View style={styles.empty}>
      <Ionicons name={icon} size={64} color={theme.colors.textSecondary} />
      <Text style={[styles.emptyTitle, { color: theme.colors.text }]}>{title}</Text>
      {message && (
        <Text style={[styles.emptyMessage, { color: theme.colors.textSecondary }]}>
          {message}
        </Text>
      )}
      {action}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.md,
  },
  text: { fontSize: 16 },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
    gap: spacing.sm,
  },
  emptyTitle: { fontSize: 18, fontWeight: '600', textAlign: 'center' },
  emptyMessage: { fontSize: 14, textAlign: 'center', lineHeight: 22 },
});

export default LoadingScreen;
