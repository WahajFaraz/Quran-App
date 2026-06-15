import React, { useEffect, useState, useRef, useCallback } from 'react';
import {
  FlatList,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  Alert,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { createAudioPlayer } from 'expo-audio';
import { Header, ScreenWrapper } from '../../components/layout/Header';
import AyahCard from '../../components/quran/AyahCard';
import LoadingScreen from '../../components/common/LoadingScreen';
import Button from '../../components/common/Button';
import { useQuranStore, useSettingsStore } from '../../store';
import { quranApi } from '../../api';
import { getTheme } from '../../theme';
import { MUSHAF_LAYOUTS } from '../../config/constants';
import { spacing, borderRadius } from '../../theme/spacing';

const MushafReaderScreen = ({ navigation, route }) => {
  const surahNumber = route.params?.surahNumber || 1;
  const { currentSurah, isLoading, fetchSurah, bookmarks, fetchBookmarks, addBookmark, removeBookmark, hifzMode, setHifzMode, hiddenAyahs, setHiddenAyahs, highlightedAyah, setHighlightedAyah, saveLastReading } = useQuranStore();
  const { showTranslation, fontSize, mushafLayout, qariId, showTafseer, updateSetting } = useSettingsStore();
  const isDark = useSettingsStore((s) => s.darkMode);
  const theme = getTheme(isDark);
  const [showSettings, setShowSettings] = useState(false);
  const [revealedAyahs, setRevealedAyahs] = useState([]);
  const playerRef = useRef(null);
  const playerStatusSubscription = useRef(null);
  const [playingAyah, setPlayingAyah] = useState(null);
  const [repeatAyah, setRepeatAyah] = useState(null);

  useEffect(() => {
    fetchSurah(surahNumber);
    fetchBookmarks();
    return () => {
      if (playerRef.current) playerRef.current.remove();
      playerStatusSubscription.current?.remove();
    };
  }, [surahNumber]);

  const isBookmarked = (ayahNumber) =>
    bookmarks.some((b) => b.surahNumber === surahNumber && b.ayahNumber === ayahNumber);

  const handleBookmark = async (ayahNumber) => {
    const existing = bookmarks.find((b) => b.surahNumber === surahNumber && b.ayahNumber === ayahNumber);
    if (existing) {
      await removeBookmark(existing._id);
    } else {
      await addBookmark(surahNumber, ayahNumber);
    }
  };

  const playAyah = async (ayahNumber) => {
    try {
      if (playerRef.current) {
        playerStatusSubscription.current?.remove();
        playerRef.current.remove();
      }
      const response = await quranApi.getAudio(qariId, surahNumber, ayahNumber);
      const player = createAudioPlayer({ uri: response.data.url });
      playerRef.current = player;
      setPlayingAyah(ayahNumber);
      playerStatusSubscription.current = player.addListener('playbackStatusUpdate', (status) => {
        if (status.didJustFinish) {
          if (repeatAyah === ayahNumber) {
            player.seekTo(0);
            player.play();
          } else {
            setPlayingAyah(null);
          }
        }
      });
      player.play();
    } catch {
      Alert.alert('Audio', 'Unable to play audio. Check your connection.');
    }
  };

  const toggleHifzMode = () => {
    if (!hifzMode && currentSurah?.ayahs) {
      const allAyahNumbers = currentSurah.ayahs.map((a) => a.ayahNumber);
      setHiddenAyahs(allAyahNumbers);
      setRevealedAyahs([]);
    }
    setHifzMode(!hifzMode);
  };

  const revealAyah = (ayahNumber) => {
    if (hifzMode) {
      setRevealedAyahs((prev) => [...prev, ayahNumber]);
    }
  };

  const renderAyah = useCallback(
    ({ item }) => {
      const isHidden = hifzMode && hiddenAyahs.includes(item.ayahNumber) && !revealedAyahs.includes(item.ayahNumber);
      return (
        <AyahCard
          ayah={item}
          surahNumber={surahNumber}
          isHighlighted={highlightedAyah === item.ayahNumber || playingAyah === item.ayahNumber}
          isHidden={isHidden}
          showTranslation={showTranslation}
          fontSize={fontSize}
          isBookmarked={isBookmarked(item.ayahNumber)}
          onPress={() => {
            setHighlightedAyah(item.ayahNumber);
            revealAyah(item.ayahNumber);
            saveLastReading({ surahNumber, ayahNumber: item.ayahNumber });
          }}
          onBookmark={() => handleBookmark(item.ayahNumber)}
          onPlay={() => playAyah(item.ayahNumber)}
        />
      );
    },
    [hifzMode, hiddenAyahs, revealedAyahs, highlightedAyah, playingAyah, bookmarks]
  );

  if (isLoading || !currentSurah) return <LoadingScreen message="Loading Surah..." />;

  return (
    <ScreenWrapper>
      <Header
        title={currentSurah.name}
        subtitle={`${currentSurah.nameAr} · ${currentSurah.numberOfAyahs} Ayahs`}
        onBack={() => navigation.goBack()}
        rightAction={
          <View style={styles.headerActions}>
            <TouchableOpacity onPress={toggleHifzMode} style={styles.headerBtn}>
              <Ionicons name={hifzMode ? 'eye-off' : 'eye'} size={22} color="#FFF" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setShowSettings(true)} style={styles.headerBtn}>
              <Ionicons name="settings-outline" size={22} color="#FFF" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('QuranSearch')} style={styles.headerBtn}>
              <Ionicons name="search" size={22} color="#FFF" />
            </TouchableOpacity>
          </View>
        }
      />

      <FlatList
        data={currentSurah.ayahs}
        renderItem={renderAyah}
        keyExtractor={(item) => `${surahNumber}-${item.ayahNumber}`}
        contentContainerStyle={styles.list}
        initialNumToRender={10}
        maxToRenderPerBatch={5}
        windowSize={7}
      />

      <Modal visible={showSettings} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.colors.card }]}>
            <Text style={[styles.modalTitle, { color: theme.colors.text }]}>Reader Settings</Text>

            <Text style={[styles.settingLabel, { color: theme.colors.text }]}>Mushaf Layout</Text>
            <View style={styles.layoutRow}>
              {MUSHAF_LAYOUTS.map((layout) => (
                <TouchableOpacity
                  key={layout.id}
                  style={[styles.layoutBtn, mushafLayout === layout.id && { backgroundColor: theme.colors.primary }]}
                  onPress={() => updateSetting('mushafLayout', layout.id)}
                >
                  <Text style={{ color: mushafLayout === layout.id ? '#FFF' : theme.colors.text, fontSize: 12 }}>
                    {layout.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.settingRow}>
              <Text style={{ color: theme.colors.text }}>Show Translation</Text>
              <Switch value={showTranslation} onValueChange={(v) => updateSetting('showTranslation', v)} trackColor={{ true: theme.colors.primary }} />
            </View>
            <View style={styles.settingRow}>
              <Text style={{ color: theme.colors.text }}>Show Tafseer</Text>
              <Switch value={showTafseer} onValueChange={(v) => updateSetting('showTafseer', v)} trackColor={{ true: theme.colors.primary }} />
            </View>

            <View style={styles.fontRow}>
              <TouchableOpacity onPress={() => updateSetting('fontSize', Math.max(16, fontSize - 2))}>
                <Ionicons name="remove-circle-outline" size={28} color={theme.colors.primary} />
              </TouchableOpacity>
              <Text style={{ color: theme.colors.text, fontSize: 16 }}>Font: {fontSize}</Text>
              <TouchableOpacity onPress={() => updateSetting('fontSize', Math.min(44, fontSize + 2))}>
                <Ionicons name="add-circle-outline" size={28} color={theme.colors.primary} />
              </TouchableOpacity>
            </View>

            <Button title="Close" variant="outline" onPress={() => setShowSettings(false)} />
          </View>
        </View>
      </Modal>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  list: { padding: spacing.md },
  headerActions: { flexDirection: 'row', gap: spacing.xs },
  headerBtn: { padding: spacing.xs },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { borderTopLeftRadius: borderRadius.xl, borderTopRightRadius: borderRadius.xl, padding: spacing.lg },
  modalTitle: { fontSize: 20, fontWeight: '700', marginBottom: spacing.lg },
  settingLabel: { fontSize: 14, fontWeight: '600', marginBottom: spacing.sm },
  layoutRow: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.lg },
  layoutBtn: { paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderRadius: borderRadius.sm, borderWidth: 1, borderColor: '#ccc' },
  settingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md },
  fontRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: spacing.lg, marginBottom: spacing.lg },
});

export default MushafReaderScreen;
