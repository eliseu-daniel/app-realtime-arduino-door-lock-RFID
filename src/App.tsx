import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { ThemeProvider, useTheme } from '@/contexts/ThemeContext';
import { useStyles } from '@/styles/styles';

function StatusBarTheme() {
  const { isDark } = useTheme();
  return <StatusBar style={isDark ? 'light' : 'dark'} />;
}

import LoginScreen from '@/screens/LoginScreen';
import RegisterScreen from '@/screens/RegisterScreen';
import DashboardScreen from '@/screens/DashboardScreen';
import DevicesScreen from '@/screens/DevicesScreen';
import LogsScreen from '@/screens/LogsScreen';
import BluetoothScreen from '@/screens/BluetoothScreen';

type Screen = 'login' | 'register' | 'dashboard' | 'devices' | 'logs' | 'bluetooth';

function AppNavigator() {
  const { user } = useAuth();
  const { isDark } = useTheme();
  const styles = useStyles();
  const [currentScreen, setCurrentScreen] = useState<Screen>('login');

  if (!user) {
    if (currentScreen === 'register') {
      return <RegisterScreen onNavigateLogin={() => setCurrentScreen('login')} />;
    }
    return <LoginScreen onNavigateRegister={() => setCurrentScreen('register')} />;
  }

  const tabs: { key: Screen; label: string }[] = [
    { key: 'dashboard', label: 'Painel' },
    // { key: 'bluetooth', label: 'Bluetooth' },
    { key: 'devices', label: 'Dispositivos' },
  ];

  function renderScreen() {
    switch (currentScreen) {
      // case 'bluetooth':
      //   return <BluetoothScreen />;
      case 'devices':
        return <DevicesScreen />;
      default:
        return <BluetoothScreen />;
    }
  }

  return (
    <View style={{ flex: 1 }}>
      {renderScreen()}
      <View style={styles.tabBar}>
        {tabs.map((tab) => {
          const isActive = currentScreen === tab.key;
          return (
            <TouchableOpacity
              key={tab.key}
              onPress={() => setCurrentScreen(tab.key)}
              style={[styles.tabItem, isActive && styles.tabItemActive]}
            >
              <Text style={[styles.tabText, isActive && styles.tabTextActive]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <StatusBarTheme />
        <AppNavigator />
      </AuthProvider>
    </ThemeProvider>
  );
}
