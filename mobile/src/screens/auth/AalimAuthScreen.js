import React, { useState } from 'react';
import { ScrollView, Text, StyleSheet, Alert } from 'react-native';
import { Header, ScreenWrapper } from '../../components/layout/Header';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { useAuthStore, useSettingsStore } from '../../store';
import { authApi } from '../../api';
import { getTheme } from '../../theme';
import { spacing } from '../../theme/spacing';

const AalimLoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const aalimLogin = useAuthStore((s) => s.aalimLogin);
  const isLoading = useAuthStore((s) => s.isLoading);
  const isDark = useSettingsStore((s) => s.darkMode);
  const theme = getTheme(isDark);

  const handleLogin = async () => {
    try {
      await aalimLogin(email.trim(), password);
    } catch (error) {
      Alert.alert('Login Failed', error.message);
    }
  };

  return (
    <ScreenWrapper>
      <Header title="Aalim Portal" subtitle="Scholar Login" onBack={() => navigation.goBack()} />
      <ScrollView style={styles.form} contentContainerStyle={styles.formContent}>
        <Text style={[styles.info, { color: theme.colors.textSecondary }]}>
          Verified Islamic scholars can answer user questions through this portal.
        </Text>
        <Input label="Email" value={email} onChangeText={setEmail} placeholder="scholar@email.com" icon="mail-outline" keyboardType="email-address" autoCapitalize="none" />
        <Input label="Password" value={password} onChangeText={setPassword} placeholder="Password" icon="lock-closed-outline" secureTextEntry />
        <Button title="Sign In as Aalim" onPress={handleLogin} loading={isLoading} />
        <Button title="Register as Aalim" variant="outline" onPress={() => navigation.navigate('AalimRegister')} style={{ marginTop: spacing.md }} />
      </ScrollView>
    </ScreenWrapper>
  );
};

const AalimRegisterScreen = ({ navigation }) => {
  const [form, setForm] = useState({ name: '', email: '', password: '', fullName: '', qualifications: '', bio: '' });
  const [loading, setLoading] = useState(false);
  const isDark = useSettingsStore((s) => s.darkMode);
  const theme = getTheme(isDark);

  const update = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const handleRegister = async () => {
    setLoading(true);
    try {
      await authApi.aalimRegister(form);
      Alert.alert('Success', 'Registration submitted. Await admin verification.', [
        { text: 'OK', onPress: () => navigation.navigate('AalimLogin') },
      ]);
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenWrapper>
      <Header title="Aalim Registration" onBack={() => navigation.goBack()} />
      <ScrollView style={styles.form} contentContainerStyle={styles.formContent}>
        <Input label="Name" value={form.name} onChangeText={(v) => update('name', v)} placeholder="Your name" />
        <Input label="Full Name" value={form.fullName} onChangeText={(v) => update('fullName', v)} placeholder="Full scholarly name" />
        <Input label="Email" value={form.email} onChangeText={(v) => update('email', v)} placeholder="Email" keyboardType="email-address" />
        <Input label="Password" value={form.password} onChangeText={(v) => update('password', v)} placeholder="Password" secureTextEntry />
        <Input label="Qualifications" value={form.qualifications} onChangeText={(v) => update('qualifications', v)} placeholder="e.g. Alim, Mufti" />
        <Input label="Bio" value={form.bio} onChangeText={(v) => update('bio', v)} placeholder="Brief introduction" multiline numberOfLines={3} />
        <Button title="Submit for Verification" onPress={handleRegister} loading={loading} />
      </ScrollView>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  form: { flex: 1 },
  formContent: { padding: spacing.lg },
  info: { fontSize: 14, lineHeight: 22, marginBottom: spacing.lg },
});

export { AalimLoginScreen, AalimRegisterScreen };
export default AalimLoginScreen;
