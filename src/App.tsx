import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { styles } from './styles/styles';

import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import DashboardScreen from './screens/DashboardScreen';
import DevicesScreen from './screens/DevicesScreen';
import LogsScreen from './screens/LogsScreen';

type Screen = 'login' | 'register' | 'dashboard' | 'devices' | 'logs';

function AppNavigator() {
  const { user } = useAuth();
  const [currentScreen, setCurrentScreen] = useState<Screen>('login');

  if (!user) {
    if (currentScreen === 'register') {
      return <RegisterScreen onNavigateLogin={() => setCurrentScreen('login')} />;
    }
    return <LoginScreen onNavigateRegister={() => setCurrentScreen('register')} />;
  }

  const tabs: { key: Screen; label: string }[] = [
    { key: 'dashboard', label: 'Painel' },
    { key: 'devices', label: 'Dispositivos' },
    { key: 'logs', label: 'Logs' },
  ];

  function renderScreen() {
    switch (currentScreen) {
      case 'devices':
        return <DevicesScreen />;
      case 'logs':
        return <LogsScreen />;
      default:
        return <DashboardScreen />;
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
    <AuthProvider>
      <StatusBar style="auto" />
      <AppNavigator />
    </AuthProvider>
  );
}
