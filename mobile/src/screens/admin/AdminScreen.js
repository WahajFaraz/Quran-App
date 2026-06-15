import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, View, Text, TouchableOpacity, Alert } from 'react-native';
import { Header, ScreenWrapper } from '../../components/layout/Header';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import LoadingScreen, { EmptyState } from '../../components/common/LoadingScreen';
import { adminApi, aalimApi, qaApi } from '../../api';
import { useSettingsStore } from '../../store';
import { getTheme } from '../../theme';
import { spacing } from '../../theme/spacing';

const AdminDashboardScreen = ({ navigation }) => {
  const [stats, setStats] = useState(null);
  const isDark = useSettingsStore((s) => s.darkMode);
  const theme = getTheme(isDark);

  useEffect(() => {
    adminApi.getDashboard().then((res) => setStats(res.data)).catch(() => {});
  }, []);

  const menuItems = [
    { label: 'Verify Aalims', screen: 'AalimVerification', count: stats?.pendingAalims },
  ];

  return (
    <ScreenWrapper>
      <Header title="Admin Dashboard" onBack={() => navigation.goBack()} />
      <View style={styles.content}>
        <View style={styles.statsGrid}>
          {[
            { label: 'Users', value: stats?.totalUsers || 0 },
            { label: 'Aalims', value: stats?.totalAalims || 0 },
            { label: 'Pending', value: stats?.pendingAalims || 0 },
            { label: 'Open Qs', value: stats?.openQuestions || 0 },
          ].map((s) => (
            <View key={s.label} style={[styles.statBox, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
              <Text style={[styles.statValue, { color: theme.colors.primary }]}>{s.value}</Text>
              <Text style={{ color: theme.colors.textSecondary, fontSize: 12 }}>{s.label}</Text>
            </View>
          ))}
        </View>

        {menuItems.map((item) => (
          <Card key={item.label} onPress={() => navigation.navigate(item.screen)}>
            <View style={styles.menuRow}>
              <Text style={[styles.menuLabel, { color: theme.colors.text }]}>{item.label}</Text>
              {item.count !== undefined && (
                <View style={[styles.badge, { backgroundColor: theme.colors.primary }]}>
                  <Text style={{ color: '#FFF', fontSize: 12, fontWeight: '600' }}>{item.count}</Text>
                </View>
              )}
            </View>
          </Card>
        ))}
      </View>
    </ScreenWrapper>
  );
};

const AalimVerificationScreen = ({ navigation }) => {
  const [aalims, setAalims] = useState([]);
  const isDark = useSettingsStore((s) => s.darkMode);
  const theme = getTheme(isDark);

  useEffect(() => {
    adminApi.getPendingAalims().then((res) => setAalims(res.data)).catch(() => {});
  }, []);

  const handleVerify = async (id) => {
    try {
      await adminApi.verifyAalim(id);
      setAalims((prev) => prev.filter((a) => a._id !== id));
      Alert.alert('Verified', 'Aalim has been verified');
    } catch (e) {
      Alert.alert('Error', e.message);
    }
  };

  const handleReject = (id) => {
    Alert.alert('Reject Aalim', 'Are you sure you want to reject this aalim?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Reject', style: 'destructive', onPress: async () => {
        try {
          await adminApi.rejectAalim(id, 'Rejected by admin');
          setAalims((prev) => prev.filter((a) => a._id !== id));
        } catch (e) {
          Alert.alert('Error', e.message);
        }
      }},
    ]);
  };

  return (
    <ScreenWrapper>
      <Header title="Verify Aalims" onBack={() => navigation.goBack()} />
      <FlatList
        data={aalims}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.content}
        ListEmptyComponent={<EmptyState icon="checkmark-circle-outline" title="All caught up" message="No pending verifications" />}
        renderItem={({ item }) => (
          <Card>
            <Text style={[styles.aalimName, { color: theme.colors.text }]}>{item.fullName}</Text>
            <Text style={{ color: theme.colors.textSecondary }}>{item.qualifications}</Text>
            <Text style={{ color: theme.colors.textSecondary, fontSize: 12 }}>{item.userId?.email}</Text>
            <View style={styles.actionRow}>
              <Button title="Verify" onPress={() => handleVerify(item._id)} style={{ flex: 1 }} />
              <Button title="Reject" variant="outline" onPress={() => handleReject(item._id)} style={{ flex: 1 }} />
            </View>
          </Card>
        )}
      />
    </ScreenWrapper>
  );
};

const AalimDashboardScreen = ({ navigation }) => {
  const [questions, setQuestions] = useState([]);
  const [selectedQ, setSelectedQ] = useState(null);
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const isDark = useSettingsStore((s) => s.darkMode);
  const theme = getTheme(isDark);

  useEffect(() => {
    aalimApi.getPendingQuestions().then((res) => setQuestions(res.data)).catch(() => {});
  }, []);

  const handleAnswer = async () => {
    if (!answer.trim() || !selectedQ) return;
    setLoading(true);
    try {
      await qaApi.createAnswer(selectedQ._id, { body: answer });
      setQuestions((prev) => prev.filter((q) => q._id !== selectedQ._id));
      setSelectedQ(null);
      setAnswer('');
      Alert.alert('Success', 'Answer posted');
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  if (selectedQ) {
    return (
      <ScreenWrapper>
        <Header title="Answer Question" onBack={() => setSelectedQ(null)} />
        <View style={styles.content}>
          <Card>
            <Text style={[styles.questionTitle, { color: theme.colors.text }]}>{selectedQ.title}</Text>
            <Text style={{ color: theme.colors.textSecondary, marginTop: spacing.sm }}>{selectedQ.body}</Text>
          </Card>
          <Input label="Your Answer" value={answer} onChangeText={setAnswer} placeholder="Provide a detailed Islamic answer with references..." multiline numberOfLines={8} />
          <Button title="Post Answer" onPress={handleAnswer} loading={loading} />
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper>
      <Header title="Aalim Dashboard" subtitle="Pending Questions" onBack={() => navigation.goBack()} />
      <FlatList
        data={questions}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.content}
        ListEmptyComponent={<EmptyState icon="checkmark-done-outline" title="No pending questions" message="All questions answered" />}
        renderItem={({ item }) => (
          <Card onPress={() => setSelectedQ(item)}>
            <Text style={[styles.categoryBadge, { color: theme.colors.secondary }]}>{item.categoryId?.name}</Text>
            <Text style={[styles.questionTitle, { color: theme.colors.text }]}>{item.title}</Text>
            <Text style={{ color: theme.colors.textSecondary, fontSize: 12 }}>
              {new Date(item.createdAt).toLocaleDateString()}
            </Text>
          </Card>
        )}
      />
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  content: { padding: spacing.md },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginBottom: spacing.lg },
  statBox: { width: '47%', padding: spacing.md, borderRadius: 12, borderWidth: 1, alignItems: 'center' },
  statValue: { fontSize: 28, fontWeight: '700' },
  menuRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  menuLabel: { fontSize: 16, fontWeight: '600' },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  aalimName: { fontSize: 18, fontWeight: '600' },
  actionRow: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.md },
  categoryBadge: { fontSize: 12, fontWeight: '600', marginBottom: spacing.xs },
  questionTitle: { fontSize: 16, fontWeight: '600' },
});

export { AalimVerificationScreen, AalimDashboardScreen };
export default AdminDashboardScreen;
