import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, View, Text, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Header, ScreenWrapper } from '../../components/layout/Header';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import LoadingScreen, { EmptyState } from '../../components/common/LoadingScreen';
import { qaApi } from '../../api';
import { useSettingsStore } from '../../store';
import { getTheme } from '../../theme';
import { spacing } from '../../theme/spacing';

const QAHomeScreen = ({ navigation }) => {
  const [categories, setCategories] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const isDark = useSettingsStore((s) => s.darkMode);
  const theme = getTheme(isDark);

  useEffect(() => {
    Promise.all([qaApi.getCategories(), qaApi.getQuestions({ status: 'answered' })])
      .then(([catRes, qRes]) => {
        setCategories(catRes.data);
        setQuestions(qRes.data);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingScreen message="Loading Q&A..." />;

  return (
    <ScreenWrapper>
      <Header
        title="Islamic Q&A"
        subtitle="Ask verified scholars"
        onBack={() => navigation.goBack()}
        rightAction={
          <TouchableOpacity onPress={() => navigation.navigate('AskQuestion')}>
            <Ionicons name="add-circle-outline" size={26} color="#FFF" />
          </TouchableOpacity>
        }
      />

      <View style={styles.content}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Categories</Text>
        <FlatList
          horizontal
          data={categories}
          keyExtractor={(item) => item._id}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.categoryChip, { backgroundColor: theme.colors.primary }]}
              onPress={() => navigation.navigate('AskQuestion', { categoryId: item._id })}
            >
              <Text style={styles.categoryText}>{item.name}</Text>
            </TouchableOpacity>
          )}
          style={{ marginBottom: spacing.lg }}
        />

        <View style={styles.rowBetween}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Recent Questions</Text>
          <TouchableOpacity onPress={() => navigation.navigate('MyQuestions')}>
            <Text style={{ color: theme.colors.primary, fontWeight: '600' }}>My Questions</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={questions}
          keyExtractor={(item) => item._id}
          ListEmptyComponent={<EmptyState icon="help-circle-outline" title="No questions yet" message="Be the first to ask!" />}
          renderItem={({ item }) => (
            <Card onPress={() => navigation.navigate('QuestionDetail', { questionId: item._id })}>
              <View style={styles.questionHeader}>
                <Text style={[styles.categoryBadge, { color: theme.colors.secondary }]}>
                  {item.categoryId?.name || 'General'}
                </Text>
                <Text style={[styles.status, { color: item.status === 'answered' ? theme.colors.success : theme.colors.warning }]}>
                  {item.status}
                </Text>
              </View>
              <Text style={[styles.questionTitle, { color: theme.colors.text }]} numberOfLines={2}>
                {item.title}
              </Text>
              <Text style={{ color: theme.colors.textSecondary, fontSize: 12 }}>
                {new Date(item.createdAt).toLocaleDateString()}
              </Text>
            </Card>
          )}
        />
      </View>
    </ScreenWrapper>
  );
};

const AskQuestionScreen = ({ navigation, route }) => {
  const [categories, setCategories] = useState([]);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [categoryId, setCategoryId] = useState(route.params?.categoryId || '');
  const [loading, setLoading] = useState(false);
  const isDark = useSettingsStore((s) => s.darkMode);
  const theme = getTheme(isDark);

  useEffect(() => {
    qaApi.getCategories().then((res) => setCategories(res.data)).catch(() => {});
  }, []);

  const handleSubmit = async () => {
    if (!title.trim() || !body.trim() || !categoryId) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }
    setLoading(true);
    try {
      await qaApi.createQuestion({ title, body, categoryId });
      Alert.alert('Success', 'Your question has been submitted', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenWrapper>
      <Header title="Ask a Question" onBack={() => navigation.goBack()} />
      <View style={styles.content}>
        <Text style={[styles.label, { color: theme.colors.text }]}>Category</Text>
        <View style={styles.categoryRow}>
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat._id}
              style={[styles.catBtn, categoryId === cat._id && { backgroundColor: theme.colors.primary }]}
              onPress={() => setCategoryId(cat._id)}
            >
              <Text style={{ color: categoryId === cat._id ? '#FFF' : theme.colors.text, fontSize: 12 }}>{cat.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <Input label="Title" value={title} onChangeText={setTitle} placeholder="Brief question title" />
        <Input label="Question" value={body} onChangeText={setBody} placeholder="Describe your question in detail..." multiline numberOfLines={5} />
        <Button title="Submit Question" onPress={handleSubmit} loading={loading} />
      </View>
    </ScreenWrapper>
  );
};

const QuestionDetailScreen = ({ navigation, route }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const isDark = useSettingsStore((s) => s.darkMode);
  const theme = getTheme(isDark);

  useEffect(() => {
    qaApi.getQuestion(route.params.questionId).then((res) => {
      setData(res.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (loading) return <LoadingScreen />;

  const { question, answers } = data;

  return (
    <ScreenWrapper>
      <Header title="Question" onBack={() => navigation.goBack()} />
      <FlatList
        data={answers}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.content}
        ListHeaderComponent={
          <Card>
            <Text style={[styles.questionTitle, { color: theme.colors.text, fontSize: 18 }]}>{question.title}</Text>
            <Text style={{ color: theme.colors.textSecondary, marginTop: spacing.sm, lineHeight: 22 }}>{question.body}</Text>
          </Card>
        }
        ListEmptyComponent={<EmptyState icon="time-outline" title="Awaiting answer" message="A verified Aalim will respond soon" />}
        renderItem={({ item }) => (
          <Card style={{ borderLeftWidth: 3, borderLeftColor: item.isAccepted ? theme.colors.success : theme.colors.primary }}>
            <Text style={{ color: theme.colors.primary, fontWeight: '600', marginBottom: spacing.sm }}>
              {item.aalimId?.fullName || 'Aalim'}
            </Text>
            <Text style={{ color: theme.colors.text, lineHeight: 22 }}>{item.body}</Text>
            {item.references?.length > 0 && (
              <Text style={{ color: theme.colors.textSecondary, fontSize: 12, marginTop: spacing.sm }}>
                References: {item.references.join(', ')}
              </Text>
            )}
          </Card>
        )}
      />
    </ScreenWrapper>
  );
};

const MyQuestionsScreen = ({ navigation }) => {
  const [questions, setQuestions] = useState([]);
  const isDark = useSettingsStore((s) => s.darkMode);
  const theme = getTheme(isDark);

  useEffect(() => {
    qaApi.getMyQuestions().then((res) => setQuestions(res.data)).catch(() => {});
  }, []);

  return (
    <ScreenWrapper>
      <Header title="My Questions" onBack={() => navigation.goBack()} />
      <FlatList
        data={questions}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.content}
        ListEmptyComponent={<EmptyState icon="help-circle-outline" title="No questions" message="Ask your first question" />}
        renderItem={({ item }) => (
          <Card onPress={() => navigation.navigate('QuestionDetail', { questionId: item._id })}>
            <Text style={[styles.questionTitle, { color: theme.colors.text }]}>{item.title}</Text>
            <Text style={{ color: theme.colors.textSecondary }}>{item.status}</Text>
          </Card>
        )}
      />
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  content: { padding: spacing.md, flex: 1 },
  sectionTitle: { fontSize: 18, fontWeight: '700', marginBottom: spacing.sm },
  categoryChip: { paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderRadius: 20, marginRight: spacing.sm },
  categoryText: { color: '#FFF', fontWeight: '600', fontSize: 13 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.sm },
  questionHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.xs },
  categoryBadge: { fontSize: 12, fontWeight: '600' },
  status: { fontSize: 12, fontWeight: '600', textTransform: 'capitalize' },
  questionTitle: { fontSize: 16, fontWeight: '600', marginBottom: spacing.xs },
  label: { fontSize: 14, fontWeight: '600', marginBottom: spacing.sm },
  categoryRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginBottom: spacing.md },
  catBtn: { paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderRadius: 20, borderWidth: 1, borderColor: '#ccc' },
});

export { AskQuestionScreen, QuestionDetailScreen, MyQuestionsScreen };
export default QAHomeScreen;
