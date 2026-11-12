import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';
// Import only the weights the app uses, so unused font files aren't bundled.
import { AtkinsonHyperlegibleNext_400Regular } from '@expo-google-fonts/atkinson-hyperlegible-next/400Regular';
import { AtkinsonHyperlegibleNext_500Medium } from '@expo-google-fonts/atkinson-hyperlegible-next/500Medium';
import { AtkinsonHyperlegibleNext_600SemiBold } from '@expo-google-fonts/atkinson-hyperlegible-next/600SemiBold';
import { AtkinsonHyperlegibleNext_700Bold } from '@expo-google-fonts/atkinson-hyperlegible-next/700Bold';
import { AppProvider } from './src/context/AppContext';
import LanguageScreen from './src/screens/LanguageScreen';
import AuthScreen from './src/screens/AuthScreen';
import ProfileSetupScreen from './src/screens/ProfileSetupScreen';
import HomeScreen from './src/screens/HomeScreen';
import ConditionsScreen from './src/screens/ConditionsScreen';
import MedicalAlertsScreen from './src/screens/MedicalAlertsScreen';
import DietPlansScreen from './src/screens/DietPlansScreen';
import DiseaseInfoScreen from './src/screens/DiseaseInfoScreen';
import AllLogsScreen from './src/screens/AllLogsScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import { t } from './src/i18n/translations';
import { useApp } from './src/context/AppContext';
import { colors, fonts, scale } from './src/theme';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  const { language } = useApp();
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.blue,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          height: scale(64) + insets.bottom,
          paddingTop: scale(6),
          paddingBottom: Math.max(insets.bottom, scale(8))
        },
        tabBarLabelStyle: {
          fontFamily: fonts.medium,
          fontSize: scale(12)
        }
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{
          title: t(language, 'tabHome'),
          tabBarIcon: ({ color, size }) => <Ionicons name="home" color={color} size={size} />
        }}
      />
      <Tab.Screen
        name="Conditions"
        component={ConditionsScreen}
        options={{
          title: t(language, 'tabConditions'),
          tabBarIcon: ({ color, size }) => <Ionicons name="pulse" color={color} size={size} />
        }}
      />
      <Tab.Screen
        name="DietPlans"
        component={DietPlansScreen}
        options={{
          title: t(language, 'tabDiet'),
          tabBarIcon: ({ color, size }) => <Ionicons name="nutrition" color={color} size={size} />
        }}
      />
      <Tab.Screen
        name="MedicalAlerts"
        component={MedicalAlertsScreen}
        options={{
          title: t(language, 'tabAlerts'),
          tabBarIcon: ({ color, size }) => <Ionicons name="notifications" color={color} size={size} />
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          title: t(language, 'tabSettings'),
          tabBarIcon: ({ color, size }) => <Ionicons name="settings" color={color} size={size} />
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  const [fontsLoaded] = useFonts({
    AtkinsonHyperlegibleNext_400Regular,
    AtkinsonHyperlegibleNext_500Medium,
    AtkinsonHyperlegibleNext_600SemiBold,
    AtkinsonHyperlegibleNext_700Bold
  });

  if (!fontsLoaded) return null;

  return (
    <SafeAreaProvider>
      <AppProvider>
        <NavigationContainer>
          <StatusBar style="dark" />
          <Stack.Navigator
            initialRouteName="Language"
            screenOptions={{
              headerStyle: { backgroundColor: colors.background },
              headerTintColor: colors.blueText,
              headerTitleStyle: { fontFamily: fonts.semibold, fontSize: scale(18), color: colors.text },
              headerBackButtonDisplayMode: 'minimal',
              contentStyle: { backgroundColor: colors.background }
            }}
          >
            <Stack.Screen name="Language" component={LanguageScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Auth" component={AuthScreen} />
            <Stack.Screen name="ProfileSetup" component={ProfileSetupScreen} />
            <Stack.Screen name="MainTabs" component={MainTabs} options={{ headerShown: false }} />
            <Stack.Screen name="DiseaseInfo" component={DiseaseInfoScreen} />
            <Stack.Screen name="AllLogs" component={AllLogsScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </AppProvider>
    </SafeAreaProvider>
  );
}
