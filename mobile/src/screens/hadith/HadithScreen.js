import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Header, ScreenWrapper } from '../../components/layout/Header';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import LoadingScreen, { EmptyState } from '../../components/common/LoadingScreen';
import { hadithApi } from '../../api';
import { useSettingsStore } from '../../store';
import { getTheme } from '../../theme';
import { borderRadius, spacing } from '../../theme/spacing';

const HadithHomeScreen = ({ navigation }) => {
  const [collections, setCollections] = useState([]);
  const isDark = useSettingsStore((s) => s.darkMode);
  const theme = getTheme(isDark);

  useEffect(() => {
    hadithApi.getCollections().then((res) => setCollections(res.data)).catch(() => {});
  }, []);

  return (
    <ScreenWrapper>
      <Header
        title="Hadith"
        subtitle="Authentic Collections"
        onBack={() => navigation.goBack()}
        rightAction={
          <TouchableOpacity onPress={() => navigation.navigate('HadithSearch')}>
            <Ionicons name="search" size={22} color="#FFF" />
          </TouchableOpacity>
        }
      />
      <FlatList
        data={collections}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <Card onPress={() => navigation.navigate('HadithBooks', { collection: item.id, collectionName: item.name })}>
            <View style={styles.collectionRow}>
              <View style={[styles.collectionIcon, { backgroundColor: theme.colors.primary + '20' }]}>
                <Ionicons name="library" size={28} color={theme.colors.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.collectionName, { color: theme.colors.text }]}>{item.name}</Text>
                <Text style={[styles.collectionAr, { color: theme.colors.textArabic }]}>{item.nameAr}</Text>
                <Text style={{ color: theme.colors.textSecondary, fontSize: 12 }}>
                  {item.author} · {item.totalHadith} hadiths
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={theme.colors.textSecondary} />
            </View>
          </Card>
        )}
      />
    </ScreenWrapper>
  );
};

const HadithBooksScreen = ({ navigation, route }) => {
  const { collection, collectionName } = route.params;
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const isDark = useSettingsStore((s) => s.darkMode);
  const theme = getTheme(isDark);

  useEffect(() => {
    hadithApi.getBooks(collection).then((res) => {
      setBooks(res.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (loading) return <LoadingScreen />;

  return (
    <ScreenWrapper>
      <Header title={collectionName} subtitle="Books" onBack={() => navigation.goBack()} />
      <FlatList
        data={books}
        keyExtractor={(item) => String(item.bookNumber)}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <Card onPress={() => navigation.navigate('HadithChapters', { collection, book: item.bookNumber, bookName: item.bookName })}>
            <Text style={[styles.bookName, { color: theme.colors.text }]}>Book {item.bookNumber}: {item.bookName}</Text>
            <Text style={{ color: theme.colors.textSecondary, fontSize: 12 }}>{item.hadithCount} hadiths</Text>
          </Card>
        )}
      />
    </ScreenWrapper>
  );
};

const HadithChaptersScreen = ({ navigation, route }) => {
  const { collection, book, bookName } = route.params;
  const [chapters, setChapters] = useState([]);
  const isDark = useSettingsStore((s) => s.darkMode);
  const theme = getTheme(isDark);

  useEffect(() => {
    hadithApi.getChapters(collection, book).then((res) => setChapters(res.data)).catch(() => {});
  }, []);

  return (
    <ScreenWrapper>
      <Header title={bookName} subtitle="Chapters" onBack={() => navigation.goBack()} />
      <FlatList
        data={chapters}
        keyExtractor={(item) => String(item.chapterNumber)}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <Card onPress={() => navigation.navigate('HadithDetail', { collection, book, chapter: item.chapterNumber, chapterName: item.chapterName })}>
            <Text style={[styles.bookName, { color: theme.colors.text }]}>{item.chapterName}</Text>
            <Text style={{ color: theme.colors.textSecondary, fontSize: 12 }}>{item.hadithCount} hadiths</Text>
          </Card>
        )}
      />
    </ScreenWrapper>
  );
};

const HadithDetailScreen = ({ navigation, route }) => {
  const { collection, book, chapter, chapterName } = route.params;
  const [hadiths, setHadiths] = useState([]);
  const isDark = useSettingsStore((s) => s.darkMode);
  const theme = getTheme(isDark);

  useEffect(() => {
    hadithApi.getChapterHadiths(collection, book, chapter).then((res) => setHadiths(res.data)).catch(() => {});
  }, []);

  return (
    <ScreenWrapper>
      <Header title={chapterName} onBack={() => navigation.goBack()} />
      <FlatList
        data={hadiths}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <Card>
            <View style={styles.hadithHeader}>
              <Text style={[styles.hadithNum, { color: theme.colors.primary }]}>#{item.hadithNumber}</Text>
              <Text style={[styles.grade, { color: theme.colors.success }]}>{item.grade}</Text>
            </View>
            <Text style={[styles.hadithArabic, { color: theme.colors.textArabic }]}>{item.arabic}</Text>
            <Text style={[styles.hadithTranslation, { color: theme.colors.text }]}>{item.translation}</Text>
            <Text style={[styles.reference, { color: theme.colors.textSecondary }]}>
              {item.reference} · {item.narrator}
            </Text>
          </Card>
        )}
      />
    </ScreenWrapper>
  );
};

const HadithSearchScreen = ({ navigation }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const isDark = useSettingsStore((s) => s.darkMode);
  const theme = getTheme(isDark);

  const handleSearch = async (text) => {
    setQuery(text);
    if (text.length >= 2) {
      try {
        const res = await hadithApi.search(text);
        setResults(res.data);
      } catch { setResults([]); }
    } else {
      setResults([]);
    }
  };

  return (
    <ScreenWrapper>
      <Header title="Search Hadith" onBack={() => navigation.goBack()} />
      <View style={{ padding: spacing.md }}>
        <Input value={query} onChangeText={handleSearch} placeholder="Search hadith..." icon="search" />
      </View>
      <FlatList
        data={results}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<EmptyState icon="search-outline" title="Search hadith" message="Enter keywords to search" />}
        renderItem={({ item }) => (
          <Card>
            <Text style={{ color: theme.colors.primary, fontWeight: '600' }}>{item.reference}</Text>
            <Text style={{ color: theme.colors.text, marginTop: spacing.xs }} numberOfLines={3}>{item.translation}</Text>
          </Card>
        )}
      />
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  list: { padding: spacing.md },
  collectionRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  collectionIcon: { width: 56, height: 56, borderRadius: borderRadius.md, justifyContent: 'center', alignItems: 'center' },
  collectionName: { fontSize: 16, fontWeight: '600' },
  collectionAr: { fontSize: 16, marginTop: 2 },
  bookName: { fontSize: 15, fontWeight: '600' },
  hadithHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.sm },
  hadithNum: { fontWeight: '700' },
  grade: { fontSize: 12, fontWeight: '600', textTransform: 'uppercase' },
  hadithArabic: { fontSize: 20, textAlign: 'right', lineHeight: 36, marginBottom: spacing.sm },
  hadithTranslation: { fontSize: 14, lineHeight: 22 },
  reference: { fontSize: 12, marginTop: spacing.sm, fontStyle: 'italic' },
});

export { HadithBooksScreen, HadithChaptersScreen, HadithDetailScreen, HadithSearchScreen };
export default HadithHomeScreen;
