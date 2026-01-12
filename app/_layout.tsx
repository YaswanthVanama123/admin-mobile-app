import { Stack } from 'expo-router';
import { PaperProvider } from 'react-native-paper';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SettingsProvider } from '../src/context/SettingsContext';
import { ToastProvider } from '../src/context/ToastContext';
import { OrdersProvider } from '../src/context/OrdersContext';
import { useEffect } from 'react';
import firebaseService from '../src/services/firebase.service';

export default function RootLayout() {
  // Setup background message handler at app entry point
  useEffect(() => {
    firebaseService.setBackgroundMessageHandler(async (remoteMessage) => {
      console.log('📱 Background message received:', remoteMessage);
      // Background messages are handled when app is in background/quit state
      // The data is processed when the app is opened
    });
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PaperProvider>
        <SettingsProvider>
          <ToastProvider>
            <OrdersProvider>
              <Stack>
                <Stack.Screen name="index" options={{ headerShown: false }} />
                <Stack.Screen name="(auth)" options={{ headerShown: false }} />
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              </Stack>
            </OrdersProvider>
          </ToastProvider>
        </SettingsProvider>
      </PaperProvider>
    </GestureHandlerRootView>
  );
}
