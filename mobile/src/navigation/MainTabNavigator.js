import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useSettingsStore } from '../store';
import { getTheme } from '../theme';

import HomeScreen from '../screens/home/HomeScreen';
import SurahListScreen, { ParaListScreen } from '../screens/quran/SurahListScreen';
import MushafReaderScreen from '../screens/quran/MushafReaderScreen';
import QuranSearchScreen, { BookmarkListScreen } from '../screens/quran/QuranSearchScreen';
import HadithHomeScreen, { HadithBooksScreen, HadithChaptersScreen, HadithDetailScreen, HadithSearchScreen } from '../screens/hadith/HadithScreen';
import PrayerTimesScreen, { QiblaCompassScreen, NearbyMasajidScreen } from '../screens/prayer/PrayerScreen';
import ProfileScreen, { SettingsScreen, MoreMenuScreen } from '../screens/profile/ProfileScreen';
import HifzDashboardScreen, { SurahHifzScreen } from '../screens/hifz/HifzScreen';
import QAHomeScreen, { AskQuestionScreen, QuestionDetailScreen, MyQuestionsScreen } from '../screens/qa/QAScreen';
import AdminDashboardScreen, { AalimVerificationScreen, AalimDashboardScreen } from '../screens/admin/AdminScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const screenOptions = { headerShown: false };

const HomeStack = () => (
  <Stack.Navigator screenOptions={screenOptions}>
    <Stack.Screen name="HomeMain" component={HomeScreen} />
    <Stack.Screen name="SurahList" component={SurahListScreen} />
    <Stack.Screen name="ParaList" component={ParaListScreen} />
    <Stack.Screen name="MushafReader" component={MushafReaderScreen} />
    <Stack.Screen name="QuranSearch" component={QuranSearchScreen} />
    <Stack.Screen name="HifzDashboard" component={HifzDashboardScreen} />
    <Stack.Screen name="SurahHifz" component={SurahHifzScreen} />
    <Stack.Screen name="QAHome" component={QAHomeScreen} />
    <Stack.Screen name="AskQuestion" component={AskQuestionScreen} />
    <Stack.Screen name="QuestionDetail" component={QuestionDetailScreen} />
    <Stack.Screen name="MyQuestions" component={MyQuestionsScreen} />
    <Stack.Screen name="PrayerTimes" component={PrayerTimesScreen} />
    <Stack.Screen name="QiblaCompass" component={QiblaCompassScreen} />
    <Stack.Screen name="NearbyMasajid" component={NearbyMasajidScreen} />
    <Stack.Screen name="Profile" component={ProfileScreen} />
    <Stack.Screen name="Settings" component={SettingsScreen} />
    <Stack.Screen name="Bookmarks" component={BookmarkListScreen} />
    <Stack.Screen name="AdminDashboard" component={AdminDashboardScreen} />
    <Stack.Screen name="AalimVerification" component={AalimVerificationScreen} />
    <Stack.Screen name="AalimDashboard" component={AalimDashboardScreen} />
    <Stack.Screen name="HadithHome" component={HadithHomeScreen} />
    <Stack.Screen name="HadithBooks" component={HadithBooksScreen} />
    <Stack.Screen name="HadithChapters" component={HadithChaptersScreen} />
    <Stack.Screen name="HadithDetail" component={HadithDetailScreen} />
    <Stack.Screen name="HadithSearch" component={HadithSearchScreen} />
    <Stack.Screen name="Notifications" component={HomeScreen} />
    <Stack.Screen name="ReadingHistory" component={HomeScreen} />
  </Stack.Navigator>
);

const QuranStack = () => (
  <Stack.Navigator screenOptions={screenOptions}>
    <Stack.Screen name="SurahList" component={SurahListScreen} />
    <Stack.Screen name="ParaList" component={ParaListScreen} />
    <Stack.Screen name="MushafReader" component={MushafReaderScreen} />
    <Stack.Screen name="QuranSearch" component={QuranSearchScreen} />
    <Stack.Screen name="Bookmarks" component={BookmarkListScreen} />
  </Stack.Navigator>
);

const LearnStack = () => (
  <Stack.Navigator screenOptions={screenOptions}>
    <Stack.Screen name="HadithHome" component={HadithHomeScreen} />
    <Stack.Screen name="HadithBooks" component={HadithBooksScreen} />
    <Stack.Screen name="HadithChapters" component={HadithChaptersScreen} />
    <Stack.Screen name="HadithDetail" component={HadithDetailScreen} />
    <Stack.Screen name="HadithSearch" component={HadithSearchScreen} />
  </Stack.Navigator>
);

const PrayerStack = () => (
  <Stack.Navigator screenOptions={screenOptions}>
    <Stack.Screen name="PrayerTimes" component={PrayerTimesScreen} />
    <Stack.Screen name="QiblaCompass" component={QiblaCompassScreen} />
    <Stack.Screen name="NearbyMasajid" component={NearbyMasajidScreen} />
  </Stack.Navigator>
);

const MoreStack = () => (
  <Stack.Navigator screenOptions={screenOptions}>
    <Stack.Screen name="MoreMenu" component={MoreMenuScreen} />
    <Stack.Screen name="Profile" component={ProfileScreen} />
    <Stack.Screen name="Settings" component={SettingsScreen} />
    <Stack.Screen name="HifzDashboard" component={HifzDashboardScreen} />
    <Stack.Screen name="QAHome" component={QAHomeScreen} />
    <Stack.Screen name="Bookmarks" component={BookmarkListScreen} />
    <Stack.Screen name="AalimDashboard" component={AalimDashboardScreen} />
    <Stack.Screen name="AdminDashboard" component={AdminDashboardScreen} />
  </Stack.Navigator>
);

const MainTabNavigator = () => {
  const isDark = useSettingsStore((s) => s.darkMode);
  const theme = getTheme(isDark);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.border,
          height: 60,
          paddingBottom: 8,
          paddingTop: 4,
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textSecondary,
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
        tabBarIcon: ({ focused, color, size }) => {
          const icons = {
            Home: focused ? 'home' : 'home-outline',
            Quran: focused ? 'book' : 'book-outline',
            Learn: focused ? 'library' : 'library-outline',
            Prayer: focused ? 'time' : 'time-outline',
            More: focused ? 'grid' : 'grid-outline',
          };
          return <Ionicons name={icons[route.name]} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeStack} />
      <Tab.Screen name="Quran" component={QuranStack} />
      <Tab.Screen name="Learn" component={LearnStack} />
      <Tab.Screen name="Prayer" component={PrayerStack} />
      <Tab.Screen name="More" component={MoreStack} />
    </Tab.Navigator>
  );
};

export default MainTabNavigator;
