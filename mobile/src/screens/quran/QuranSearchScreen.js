import React, { useState } from 'react';
import { FlatList, TextInput, StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Header, ScreenWrapper } from '../../components/layout/Header';
import LoadingScreen, { EmptyState } from '../../components/common/LoadingScreen';
import { useQuranStore, useSettingsStore } from '../../store';
import { getTheme } from '../../theme';
import { borderRadius, spacing } from '../../theme/spacing';

const QuranSearchScreen = ({ navigation }) => {
  const [query, setQuery] = useState('');
  const { searchResults, isLoading, searchQuran } = useQuranStore();
  const isDark = useSettingsStore((s) => s.darkMode);
  const theme = getTheme(isDark);

  const handleSearch = (text) => {
    setQuery(text);
    searchQuran(text);
  };

  return (
    <ScreenWrapper>
      <Header title="Search Quran" onBack={() => navigation.goBack()} />
      <View style={styles.searchContainer}>
        <TextInput
          style={[styles.searchInput, { backgroundColor: theme.colors.surface, color: theme.colors.text, borderColor: theme.colors.border }]}
          placeholder="Search by Arabic or translation..."
          placeholderTextColor={theme.colors.textSecondary}
          value={query}
          onChangeText={handleSearch}
          autoFocus
        />
      </View>

      {isLoading ? (
        <LoadingScreen message="Searching..." />
      ) : (
        <FlatList
          data={searchResults}
          keyExtractor={(item) => `${item.surahNumber}-${item.ayahNumber}`}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            query.length >= 2 ? (
              <EmptyState icon="search-outline" title="No results" message="Try different keywords" />
            ) : (
              <EmptyState icon="search-outline" title="Search the Quran" message="Enter at least 2 characters" />
            )
          }
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.resultCard, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}
              onPress={() => navigation.navigate('MushafReader', { surahNumber: item.surahNumber })}
            >
              <Text style={[styles.resultRef, { color: theme.colors.primary }]}>
                Surah {item.surahNumber}:{item.ayahNumber}
              </Text>
              <Text style={[styles.resultArabic, { color: theme.colors.textArabic }]} numberOfLines={2}>
                {item.arabic}
              </Text>
              <Text style={[styles.resultTranslation, { color: theme.colors.textSecondary }]} numberOfLines={2}>
                {item.translation}
              </Text>
            </TouchableOpacity>
          )}
        />
      )}
    </ScreenWrapper>
  );
};

const BookmarkListScreen = ({ navigation }) => {
  const { bookmarks, fetchBookmarks } = useQuranStore();
  const isDark = useSettingsStore((s) => s.darkMode);
  const theme = getTheme(isDark);

  React.useEffect(() => { fetchBookmarks(); }, []);

  return (
    <ScreenWrapper>
      <Header title="Bookmarks" onBack={() => navigation.goBack()} />
      <FlatList
        data={bookmarks}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<EmptyState icon="bookmark-outline" title="No bookmarks" message="Bookmark ayahs while reading" />}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.resultCard, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}
            onPress={() => navigation.navigate('MushafReader', { surahNumber: item.surahNumber })}
          >
            <Text style={[styles.resultRef, { color: theme.colors.primary }]}>
              Surah {item.surahNumber}:{item.ayahNumber}
            </Text>
            {item.note ? <Text style={{ color: theme.colors.textSecondary }}>{item.note}</Text> : null}
          </TouchableOpacity>
        )}
      />
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  searchContainer: { padding: spacing.md },
  searchInput: { borderWidth: 1, borderRadius: borderRadius.md, padding: spacing.md, fontSize: 16 },
  list: { padding: spacing.md },
  resultCard: { padding: spacing.md, borderRadius: borderRadius.md, borderWidth: 1, marginBottom: spacing.sm },
  resultRef: { fontSize: 13, fontWeight: '600', marginBottom: spacing.xs },
  resultArabic: { fontSize: 18, textAlign: 'right', marginBottom: spacing.xs },
  resultTranslation: { fontSize: 13, fontStyle: 'italic' },
});

export { BookmarkListScreen };
export default QuranSearchScreen;
