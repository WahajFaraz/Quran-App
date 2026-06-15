import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useSettingsStore } from '../../store';
import { getTheme } from '../../theme';
import { spacing } from '../../theme/spacing';
import IslamicPattern from '../islamic/IslamicPattern';

const Header = ({
  title,
  subtitle,
  onBack,
  rightAction,
  showPattern = true,
  transparent = false,
}) => {
  const insets = useSafeAreaInsets();
  const isDark = useSettingsStore((s) => s.darkMode);
  const theme = getTheme(isDark);

  const content = (
    <View style={[styles.content, { paddingTop: insets.top + spacing.sm }]}>
      <View style={styles.row}>
        {onBack && (
          <TouchableOpacity onPress={onBack} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color="#FFF" />
          </TouchableOpacity>
        )}
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{title}</Text>
          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        </View>
        {rightAction && <View style={styles.rightAction}>{rightAction}</View>}
      </View>
      {showPattern && <IslamicPattern height={40} opacity={0.15} />}
    </View>
  );

  if (transparent) {
    return <View style={styles.transparent}>{content}</View>;
  }

  return (
    <LinearGradient colors={theme.colors.gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
      {content}
    </LinearGradient>
  );
};

const ScreenWrapper = ({ children, style }) => {
  const isDark = useSettingsStore((s) => s.darkMode);
  const theme = getTheme(isDark);

  return (
    <View style={[styles.screen, { backgroundColor: theme.colors.background }, style]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  content: { paddingHorizontal: spacing.md, paddingBottom: spacing.md },
  row: { flexDirection: 'row', alignItems: 'center', minHeight: 48 },
  backBtn: { marginRight: spacing.sm, padding: spacing.xs },
  titleContainer: { flex: 1 },
  title: { fontSize: 22, fontWeight: '700', color: '#FFF', letterSpacing: 0.5 },
  subtitle: { fontSize: 13, color: 'rgba(255,255,255,0.8)', marginTop: 2 },
  rightAction: { marginLeft: spacing.sm },
  transparent: { backgroundColor: 'transparent' },
  screen: { flex: 1 },
});

export { Header, ScreenWrapper };
export default Header;
