import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Path, Circle, G } from 'react-native-svg';
import { useSettingsStore } from '../../store';
import { getTheme } from '../../theme';

const IslamicPattern = ({ width = '100%', height = 80, opacity = 0.08 }) => {
  const isDark = useSettingsStore((s) => s.darkMode);
  const theme = getTheme(isDark);
  const color = theme.colors.secondary;

  return (
    <View style={[styles.container, { height, opacity }]}>
      <Svg width={width} height={height} viewBox="0 0 400 80">
        <G fill={color}>
          {[...Array(10)].map((_, i) => (
            <G key={i} transform={`translate(${i * 40}, 0)`}>
              <Path d="M20,0 L40,20 L20,40 L0,20 Z" />
              <Circle cx="20" cy="20" r="6" fill="none" stroke={color} strokeWidth="1" />
              <Path d="M20,8 L28,20 L20,32 L12,20 Z" fill="none" stroke={color} strokeWidth="0.5" />
            </G>
          ))}
        </G>
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { overflow: 'hidden' },
});

export default IslamicPattern;
