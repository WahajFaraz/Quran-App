import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { ScreenWrapper } from '../../components/layout/Header';
import IslamicPattern from '../../components/islamic/IslamicPattern';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { useAuthStore, useSettingsStore } from '../../store';
import { getTheme } from '../../theme';
import { spacing } from '../../theme/spacing';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const login = useAuthStore((s) => s.login);
  const isLoading = useAuthStore((s) => s.isLoading);
  const isDark = useSettingsStore((s) => s.darkMode);
  const theme = getTheme(isDark);

  const validate = () => {
    const newErrors = {};
    if (!email) newErrors.email = 'Email is required';
    if (!password) newErrors.password = 'Password is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validate()) return;
    try {
      await login(email.trim(), password);
    } catch (error) {
      Alert.alert('Login Failed', error.message);
    }
  };

  return (
    <ScreenWrapper>
      <LinearGradient colors={theme.colors.gradient} style={styles.header}>
        <IslamicPattern height={60} opacity={0.12} />
        <View style={styles.headerContent}>
          <Ionicons name="book" size={48} color={theme.colors.secondary} />
          <Text style={styles.appTitle}>Quran & Learning</Text>
          <Text style={styles.appSubtitle}>بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</Text>
        </View>
      </LinearGradient>

      <ScrollView style={styles.form} contentContainerStyle={styles.formContent}>
        <Text style={[styles.formTitle, { color: theme.colors.text }]}>Welcome Back</Text>
        <Text style={[styles.formSubtitle, { color: theme.colors.textSecondary }]}>
          Sign in to continue your spiritual journey
        </Text>

        <Input
          label="Email"
          value={email}
          onChangeText={setEmail}
          placeholder="your@email.com"
          icon="mail-outline"
          keyboardType="email-address"
          autoCapitalize="none"
          error={errors.email}
        />
        <Input
          label="Password"
          value={password}
          onChangeText={setPassword}
          placeholder="Enter password"
          icon="lock-closed-outline"
          secureTextEntry
          error={errors.password}
        />

        <Button title="Sign In" onPress={handleLogin} loading={isLoading} />

        <TouchableOpacity
          onPress={() => navigation.navigate('Register')}
          style={styles.linkContainer}
        >
          <Text style={[styles.link, { color: theme.colors.textSecondary }]}>
            Don't have an account?{' '}
            <Text style={{ color: theme.colors.primary, fontWeight: '600' }}>Register</Text>
          </Text>
        </TouchableOpacity>

        <View style={styles.divider}>
          <View style={[styles.dividerLine, { backgroundColor: theme.colors.border }]} />
          <Text style={[styles.dividerText, { color: theme.colors.textSecondary }]}>or</Text>
          <View style={[styles.dividerLine, { backgroundColor: theme.colors.border }]} />
        </View>

        <Button
          title="Aalim Portal"
          variant="outline"
          onPress={() => navigation.navigate('AalimLogin')}
        />
      </ScrollView>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  header: { paddingTop: 60, paddingBottom: 30 },
  headerContent: { alignItems: 'center', paddingHorizontal: spacing.lg },
  appTitle: { fontSize: 28, fontWeight: '700', color: '#FFF', marginTop: spacing.md },
  appSubtitle: { fontSize: 18, color: 'rgba(255,255,255,0.9)', marginTop: spacing.xs },
  form: { flex: 1 },
  formContent: { padding: spacing.lg, paddingTop: spacing.xl },
  formTitle: { fontSize: 24, fontWeight: '700' },
  formSubtitle: { fontSize: 14, marginTop: spacing.xs, marginBottom: spacing.lg },
  linkContainer: { alignItems: 'center', marginTop: spacing.md },
  link: { fontSize: 14 },
  divider: { flexDirection: 'row', alignItems: 'center', marginVertical: spacing.lg },
  dividerLine: { flex: 1, height: 1 },
  dividerText: { marginHorizontal: spacing.md, fontSize: 13 },
});

export default LoginScreen;
