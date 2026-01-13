/**
 * Main App Entry Point - React Native CLI
 * Migrated from Expo to React Native CLI
 */

import React, { useEffect } from 'react';
import { StatusBar } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { PaperProvider } from 'react-native-paper';
import { SettingsProvider } from './src/context/SettingsContext';
import { ToastProvider } from './src/context/ToastContext';
import { OrdersProvider } from './src/context/OrdersContext';
import { AuthProvider } from './src/context/AuthContext';
import RootNavigator from './src/navigation/RootNavigator';
import firebaseService from './src/services/firebase.service';
import soundVibrationService from './src/services/soundVibration.service';

export default function App() {
  useEffect(() => {
    // Initialize services on app start
    const initializeApp = async () => {
      try {
        // Initialize Firebase messaging
        console.log('🚀 Initializing Firebase...');
        await firebaseService.initialize();

        // Initialize sound and vibration
        console.log('🔊 Initializing sound & vibration...');
        await soundVibrationService.initialize();

        // Set background message handler for Firebase
        firebaseService.setBackgroundMessageHandler(async (remoteMessage) => {
          console.log('📱 Background message received:', remoteMessage);
          // Background messages are handled by Firebase, no action needed here
        });

        console.log('✅ App initialization complete');
      } catch (error) {
        console.error('❌ App initialization failed:', error);
      }
    };

    initializeApp();

    // Cleanup on unmount
    return () => {
      soundVibrationService.cleanup();
    };
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PaperProvider>
        <AuthProvider>
          <SettingsProvider>
            <ToastProvider>
              <OrdersProvider>
                <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
                <RootNavigator />
              </OrdersProvider>
            </ToastProvider>
          </SettingsProvider>
        </AuthProvider>
      </PaperProvider>
    </GestureHandlerRootView>
  );
}
