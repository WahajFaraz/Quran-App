import React, { useEffect, useCallback, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import RootNavigator from './src/navigation/RootNavigator';
import { useAuthStore, useSettingsStore } from './src/store';

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function App() {
  const initializeAuth = useAuthStore((s) => s.initialize);
  const initializeSettings = useSettingsStore((s) => s.initialize);
  const isDark = useSettingsStore((s) => s.darkMode);
  const isLoading = useAuthStore((s) => s.isLoading);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        await Promise.all([initializeAuth(), initializeSettings()]);
      } catch (e) {
        console.error('Init error:', e);
      } finally {
        setReady(true);
        await SplashScreen.hideAsync().catch(() => {});
      }
    };

    const timeout = setTimeout(() => {
      setReady(true);
      SplashScreen.hideAsync().catch(() => {});
    }, 5000);

    init().finally(() => clearTimeout(timeout));
    return () => clearTimeout(timeout);
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (ready && !isLoading) {
      await SplashScreen.hideAsync().catch(() => {});
    }
  }, [ready, isLoading]);

  if (!ready || isLoading) {
    return (
      <View style={styles.boot}>
        <Text style={styles.bootText}>Loading Quran App...</Text>
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <SafeAreaProvider>
        <StatusBar style={isDark ? 'light' : 'dark'} />
        <RootNavigator />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  boot: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1B4332',
  },
  bootText: {
    color: '#D4AF37',
    fontSize: 16,
    fontWeight: '600',
  },
});
