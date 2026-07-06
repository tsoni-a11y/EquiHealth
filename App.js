import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppProvider } from './src/context/AppContext';
import LanguageScreen from './src/screens/LanguageScreen';
import AuthScreen from './src/screens/AuthScreen';
import OtpVerificationScreen from './src/screens/OtpVerificationScreen';
import ProfileSetupScreen from './src/screens/ProfileSetupScreen';
import HomeScreen from './src/screens/HomeScreen';
import ConditionsScreen from './src/screens/ConditionsScreen';
import MedicalAlertsScreen from './src/screens/MedicalAlertsScreen';
// import DietPlansScreen from './src/screens/DietPlansScreen'; // TODO: Fix VoiceButton import
import DiseaseInfoScreen from './src/screens/DiseaseInfoScreen';
import AllLogsScreen from './src/screens/AllLogsScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import { t } from './src/i18n/translations';
import { useApp } from './src/context/AppContext';
import { scale } from './src/theme';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  const { language } = useApp();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#0e9fbe',
        tabBarInactiveTintColor: '#7a8f96',
        tabBarStyle: {
          position: 'absolute',
          left: scale(8),
          right: scale(8),
          bottom: scale(8),
          height: scale(70),
          paddingBottom: scale(10),
          paddingTop: scale(6),
          borderTopColor: '#d6e8ec',
          borderTopWidth: 1,
          backgroundColor: '#132A36',
          borderRadius: scale(18)
        },
        tabBarItemStyle: {
          paddingHorizontal: scale(2)
        },
        tabBarLabelStyle: {
          fontSize: scale(10),
          fontWeight: '700'
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
      {/* TEMPORARILY DISABLED during OTP testing
      <Tab.Screen
        name="DietPlans"
        component={DietPlansScreen}
        options={{
          title: t(language, 'tabDiet'),
          tabBarIcon: ({ color, size }) => <Ionicons name="nutrition" color={color} size={size} />
        }}
      />
      */}
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
  return (
    <SafeAreaProvider>
      <AppProvider>
        <NavigationContainer>
          <StatusBar style="light" />
          <Stack.Navigator
            initialRouteName="Language"
            screenOptions={{
              headerStyle: { backgroundColor: '#0e9fbe' },
              headerTintColor: '#fff',
              headerTitleStyle: { fontWeight: '700' }
            }}
          >
            <Stack.Screen name="Language" component={LanguageScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Auth" component={AuthScreen} />
            <Stack.Screen name="OtpVerification" component={OtpVerificationScreen} />
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
