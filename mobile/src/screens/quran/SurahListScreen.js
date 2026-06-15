import React, { useEffect, useState, useCallback } from 'react';
import { FlatList, TextInput, StyleSheet, View } from 'react-native';
import { Header, ScreenWrapper } from '../../components/layout/Header';
import { SurahCard } from '../../components/common/Card';
import LoadingScreen, { EmptyState } from '../../components/common/LoadingScreen';
import { useQuranStore, useSettingsStore } from '../../store';
import { getTheme } from '../../theme';
import { borderRadius, spacing } from '../../theme/spacing';

const SurahListScreen = ({ navigation }) => {
  const { surahs, isLoading, fetchSurahs } = useQuranStore();
  const [search, setSearch] = useState('');
  const isDark = useSettingsStore((s) => s.darkMode);
  const theme = getTheme(isDark);

  useEffect(() => {
    fetchSurahs();
  }, []);

  const filtered = surahs.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.nameAr.includes(search) ||
      String(s.number).includes(search)
  );

  const renderItem = useCallback(
    ({ item }) => (
      <SurahCard
        surah={item}
        onPress={() => navigation.navigate('MushafReader', { surahNumber: item.number })}
      />
    ),
    [navigation]
  );

  if (isLoading && surahs.length === 0) return <LoadingScreen message="Loading Surahs..." />;

  return (
    <ScreenWrapper>
      <Header
        title="Quran"
        subtitle="114 Surahs"
        onBack={() => navigation.goBack()}
        rightAction={
          <View style={styles.headerActions}>
            <Text style={styles.headerLink} onPress={() => navigation.navigate('ParaList')}>
              Paras
            </Text>
          </View>
        }
      />

      <View style={styles.searchContainer}>
        <TextInput
          style={[styles.searchInput, { backgroundColor: theme.colors.surface, color: theme.colors.text, borderColor: theme.colors.border }]}
          placeholder="Search surah..."
          placeholderTextColor={theme.colors.textSecondary}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      <FlatList
        data={filtered}
        renderItem={renderItem}
        keyExtractor={(item) => String(item.number)}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <EmptyState icon="book-outline" title="No surahs found" message="Try a different search term" />
        }
      />
    </ScreenWrapper>
  );
};

const ParaListScreen = ({ navigation }) => {
  const [paras, setParas] = useState([]);
  const isDark = useSettingsStore((s) => s.darkMode);
  const theme = getTheme(isDark);

  useEffect(() => {
    import('../../api').then(({ quranApi }) => {
      quranApi.getParas().then((res) => setParas(res.data));
    });
  }, []);

  return (
    <ScreenWrapper>
      <Header title="Paras (Juz)" subtitle="30 Parts" onBack={() => navigation.goBack()} />
      <FlatList
        data={paras}
        contentContainerStyle={styles.list}
        keyExtractor={(item) => String(item.number)}
        renderItem={({ item }) => (
          <SurahCard
            surah={{ number: item.number, name: item.name, nameAr: item.nameAr, revelationType: `Starts Surah ${item.startSurah}`, numberOfAyahs: 0 }}
            onPress={() => navigation.navigate('MushafReader', { surahNumber: item.startSurah })}
          />
        )}
      />
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  searchContainer: { padding: spacing.md, paddingBottom: 0 },
  searchInput: { borderWidth: 1, borderRadius: borderRadius.md, padding: spacing.md, fontSize: 16 },
  list: { padding: spacing.md },
  headerActions: { flexDirection: 'row' },
  headerLink: { color: '#FFF', fontSize: 14, fontWeight: '600' },
});

export { ParaListScreen };
export default SurahListScreen;
