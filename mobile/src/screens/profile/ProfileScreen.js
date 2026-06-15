import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Header, ScreenWrapper } from '../../components/layout/Header';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { useAuthStore, useSettingsStore } from '../../store';
import { getTheme } from '../../theme';
import { LANGUAGES, MUSHAF_LAYOUTS } from '../../config/constants';
import { spacing } from '../../theme/spacing';

const ProfileScreen = ({ navigation }) => {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const isDark = useSettingsStore((s) => s.darkMode);
  const theme = getTheme(isDark);

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', style: 'destructive', onPress: logout },
    ]);
  };

  const menuItems = [
    { icon: 'bookmark-outline', label: 'Bookmarks', screen: 'Bookmarks' },
    { icon: 'time-outline', label: 'Reading History', screen: 'ReadingHistory' },
    { icon: 'notifications-outline', label: 'Notifications', screen: 'Notifications' },
    { icon: 'settings-outline', label: 'Settings', screen: 'Settings' },
    { icon: 'help-circle-outline', label: 'Islamic Q&A', screen: 'QAHome' },
    { icon: 'school-outline', label: 'Hifz Tracker', screen: 'HifzDashboard' },
  ];

  if (user?.role === 'admin') {
    menuItems.push({ icon: 'shield-outline', label: 'Admin Dashboard', screen: 'AdminDashboard' });
  }
  if (user?.role === 'aalim') {
    menuItems.push({ icon: 'create-outline', label: 'Aalim Dashboard', screen: 'AalimDashboard' });
  }

  return (
    <ScreenWrapper>
      <Header title="Profile" onBack={() => navigation.goBack()} />
      <ScrollView style={styles.content}>
        <Card style={styles.profileCard}>
          <View style={[styles.avatar, { backgroundColor: theme.colors.primary }]}>
            <Text style={styles.avatarText}>{user?.name?.[0]?.toUpperCase() || 'U'}</Text>
          </View>
          <Text style={[styles.name, { color: theme.colors.text }]}>{user?.name}</Text>
          <Text style={{ color: theme.colors.textSecondary }}>{user?.email}</Text>
          <View style={[styles.roleBadge, { backgroundColor: theme.colors.secondary + '30' }]}>
            <Text style={{ color: theme.colors.secondary, fontWeight: '600', textTransform: 'capitalize' }}>
              {user?.role || 'user'}
            </Text>
          </View>
        </Card>

        {menuItems.map((item) => (
          <TouchableOpacity
            key={item.label}
            style={[styles.menuItem, { borderBottomColor: theme.colors.border }]}
            onPress={() => navigation.navigate(item.screen)}
          >
            <Ionicons name={item.icon} size={22} color={theme.colors.primary} />
            <Text style={[styles.menuLabel, { color: theme.colors.text }]}>{item.label}</Text>
            <Ionicons name="chevron-forward" size={18} color={theme.colors.textSecondary} />
          </TouchableOpacity>
        ))}

        <Button title="Logout" variant="outline" onPress={handleLogout} style={{ marginTop: spacing.lg }} />
      </ScrollView>
    </ScreenWrapper>
  );
};

const SettingsScreen = ({ navigation }) => {
  const { darkMode, language, mushafLayout, showTranslation, azanNotifications, toggleDarkMode, updateSetting } = useSettingsStore();
  const isDark = darkMode;
  const theme = getTheme(isDark);

  return (
    <ScreenWrapper>
      <Header title="Settings" onBack={() => navigation.goBack()} />
      <ScrollView style={styles.content}>
        <Card>
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Ionicons name="moon-outline" size={22} color={theme.colors.primary} />
              <Text style={[styles.settingLabel, { color: theme.colors.text }]}>Dark Mode</Text>
            </View>
            <Switch value={darkMode} onValueChange={toggleDarkMode} trackColor={{ true: theme.colors.primary }} />
          </View>
        </Card>

        <Card>
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Ionicons name="notifications-outline" size={22} color={theme.colors.primary} />
              <Text style={[styles.settingLabel, { color: theme.colors.text }]}>Azan Notifications</Text>
            </View>
            <Switch value={azanNotifications} onValueChange={(v) => updateSetting('azanNotifications', v)} trackColor={{ true: theme.colors.primary }} />
          </View>
        </Card>

        <Card>
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Ionicons name="language-outline" size={22} color={theme.colors.primary} />
              <Text style={[styles.settingLabel, { color: theme.colors.text }]}>Show Translation</Text>
            </View>
            <Switch value={showTranslation} onValueChange={(v) => updateSetting('showTranslation', v)} trackColor={{ true: theme.colors.primary }} />
          </View>
        </Card>

        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Language</Text>
        <View style={styles.optionRow}>
          {LANGUAGES.map((lang) => (
            <TouchableOpacity
              key={lang.code}
              style={[styles.optionBtn, language === lang.code && { backgroundColor: theme.colors.primary }]}
              onPress={() => updateSetting('language', lang.code)}
            >
              <Text style={{ color: language === lang.code ? '#FFF' : theme.colors.text }}>{lang.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Mushaf Layout</Text>
        <View style={styles.optionRow}>
          {MUSHAF_LAYOUTS.map((layout) => (
            <TouchableOpacity
              key={layout.id}
              style={[styles.optionBtn, mushafLayout === layout.id && { backgroundColor: theme.colors.primary }]}
              onPress={() => updateSetting('mushafLayout', layout.id)}
            >
              <Text style={{ color: mushafLayout === layout.id ? '#FFF' : theme.colors.text, fontSize: 12 }}>
                {layout.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
};

const MoreMenuScreen = ({ navigation }) => {
  const isDark = useSettingsStore((s) => s.darkMode);
  const theme = getTheme(isDark);

  const items = [
    { icon: 'person-outline', label: 'Profile', screen: 'Profile', color: theme.colors.primary },
    { icon: 'school-outline', label: 'Hifz Tracker', screen: 'HifzDashboard', color: '#40916C' },
    { icon: 'help-circle-outline', label: 'Islamic Q&A', screen: 'QAHome', color: '#D4AF37' },
    { icon: 'bookmark-outline', label: 'Bookmarks', screen: 'Bookmarks', color: '#2D6A4F' },
    { icon: 'settings-outline', label: 'Settings', screen: 'Settings', color: '#6B6B6B' },
  ];

  return (
    <ScreenWrapper>
      <Header title="More" />
      <ScrollView style={styles.content}>
        {items.map((item) => (
          <TouchableOpacity
            key={item.label}
            style={[styles.moreItem, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}
            onPress={() => navigation.navigate(item.screen)}
          >
            <View style={[styles.moreIcon, { backgroundColor: item.color + '20' }]}>
              <Ionicons name={item.icon} size={24} color={item.color} />
            </View>
            <Text style={[styles.moreLabel, { color: theme.colors.text }]}>{item.label}</Text>
            <Ionicons name="chevron-forward" size={18} color={theme.colors.textSecondary} />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  content: { padding: spacing.md },
  profileCard: { alignItems: 'center', padding: spacing.lg, marginBottom: spacing.lg },
  avatar: { width: 80, height: 80, borderRadius: 40, justifyContent: 'center', alignItems: 'center', marginBottom: spacing.md },
  avatarText: { color: '#FFF', fontSize: 32, fontWeight: '700' },
  name: { fontSize: 22, fontWeight: '700' },
  roleBadge: { paddingHorizontal: spacing.md, paddingVertical: spacing.xs, borderRadius: 20, marginTop: spacing.sm },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.md, borderBottomWidth: 1, gap: spacing.md },
  menuLabel: { flex: 1, fontSize: 16 },
  settingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  settingInfo: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  settingLabel: { fontSize: 16 },
  sectionTitle: { fontSize: 16, fontWeight: '700', marginTop: spacing.lg, marginBottom: spacing.sm },
  optionRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginBottom: spacing.md },
  optionBtn: { paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderRadius: 20, borderWidth: 1, borderColor: '#ccc' },
  moreItem: { flexDirection: 'row', alignItems: 'center', padding: spacing.md, borderRadius: 12, borderWidth: 1, marginBottom: spacing.sm, gap: spacing.md },
  moreIcon: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center' },
  moreLabel: { flex: 1, fontSize: 16, fontWeight: '600' },
});

export { SettingsScreen, MoreMenuScreen };
export default ProfileScreen;
