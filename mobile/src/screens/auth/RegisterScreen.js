import React, { useState } from 'react';
import { ScrollView, Text, StyleSheet, Alert } from 'react-native';
import { Header, ScreenWrapper } from '../../components/layout/Header';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { useAuthStore, useSettingsStore } from '../../store';
import { getTheme } from '../../theme';
import { spacing } from '../../theme/spacing';

const RegisterScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const register = useAuthStore((s) => s.register);
  const isLoading = useAuthStore((s) => s.isLoading);
  const isDark = useSettingsStore((s) => s.darkMode);
  const theme = getTheme(isDark);

  const validate = () => {
    const newErrors = {};
    if (!name.trim()) newErrors.name = 'Name is required';
    if (!email) newErrors.email = 'Email is required';
    if (!password || password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (password !== confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validate()) return;
    try {
      await register(name.trim(), email.trim(), password);
      Alert.alert('Success', 'Account created successfully! Please login.', [
        { text: 'OK', onPress: () => navigation.navigate('Login') },
      ]);
    } catch (error) {
      Alert.alert('Registration Failed', error.message);
    }
  };

  return (
    <ScreenWrapper>
      <Header title="Create Account" onBack={() => navigation.goBack()} showPattern={false} />
      <ScrollView style={styles.form} contentContainerStyle={styles.formContent}>
        <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
          Join our community of learners
        </Text>

        <Input label="Full Name" value={name} onChangeText={setName} placeholder="Your name" icon="person-outline" error={errors.name} />
        <Input label="Email" value={email} onChangeText={setEmail} placeholder="your@email.com" icon="mail-outline" keyboardType="email-address" autoCapitalize="none" error={errors.email} />
        <Input label="Password" value={password} onChangeText={setPassword} placeholder="Min 6 characters" icon="lock-closed-outline" secureTextEntry error={errors.password} />
        <Input label="Confirm Password" value={confirmPassword} onChangeText={setConfirmPassword} placeholder="Confirm password" icon="lock-closed-outline" secureTextEntry error={errors.confirmPassword} />

        <Button title="Create Account" onPress={handleRegister} loading={isLoading} />
      </ScrollView>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  form: { flex: 1 },
  formContent: { padding: spacing.lg },
  subtitle: { fontSize: 14, marginBottom: spacing.lg },
});

export default RegisterScreen;
