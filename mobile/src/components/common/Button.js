import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSettingsStore } from '../../store';
import { getTheme } from '../../theme';
import { borderRadius, spacing } from '../../theme/spacing';

const Button = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon,
  style,
  textStyle,
}) => {
  const isDark = useSettingsStore((s) => s.darkMode);
  const theme = getTheme(isDark);

  const isPrimary = variant === 'primary';
  const isOutline = variant === 'outline';
  const isGhost = variant === 'ghost';

  const height = size === 'sm' ? 40 : size === 'lg' ? 56 : 48;
  const fontSize = size === 'sm' ? 14 : size === 'lg' ? 18 : 16;

  const content = (
    <View style={[styles.content, { height }]}>
      {loading ? (
        <ActivityIndicator color={isPrimary ? '#FFF' : theme.colors.primary} />
      ) : (
        <>
          {icon}
          <Text
            style={[
              styles.text,
              {
                fontSize,
                color: isPrimary ? '#FFF' : isOutline || isGhost ? theme.colors.primary : theme.colors.text,
              },
              textStyle,
            ]}
          >
            {title}
          </Text>
        </>
      )}
    </View>
  );

  if (isPrimary) {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled || loading}
        activeOpacity={0.8}
        style={[styles.wrapper, { opacity: disabled ? 0.5 : 1 }, style]}
      >
        <LinearGradient
          colors={theme.colors.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.gradient, { borderRadius: borderRadius.md }]}
        >
          {content}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
      style={[
        styles.wrapper,
        {
          borderRadius: borderRadius.md,
          borderWidth: isOutline ? 1.5 : 0,
          borderColor: theme.colors.primary,
          backgroundColor: isGhost ? 'transparent' : theme.colors.surface,
          opacity: disabled ? 0.5 : 1,
        },
        style,
      ]}
    >
      {content}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  wrapper: { width: '100%' },
  gradient: { width: '100%' },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
  },
  text: { fontWeight: '600', letterSpacing: 0.3 },
});

export default Button;
