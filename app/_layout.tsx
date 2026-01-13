import { ErrorBoundary, Stack } from 'expo-router';
import { PaperProvider } from 'react-native-paper';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { View, Text, StyleSheet } from 'react-native';
import { SettingsProvider } from '../src/context/SettingsContext';
import { ToastProvider } from '../src/context/ToastContext';
import { OrdersProvider } from '../src/context/OrdersContext';
import { AdminAuthProvider } from '../src/context/AdminAuthContext';
import { useEffect } from 'react';
import firebaseService from '../src/services/firebase.service';

function RootLayoutErrorFallback({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  console.error('[RootLayout] Render error:', error);

  return (
    <View style={styles.fallbackContainer}>
      <Text style={styles.fallbackTitle}>Something went wrong</Text>
      <Text style={styles.fallbackMessage}>{error?.message || 'Unknown error occurred'}</Text>
      <Text style={styles.fallbackHint}>Open the debugger or restart the app to recover.</Text>
      <Text style={styles.fallbackButton} onPress={reset}>
        Retry
      </Text>
    </View>
  );
}

export default function RootLayout() {
  // Setup background message handler at app entry point
  useEffect(() => {
    firebaseService.setBackgroundMessageHandler(async (remoteMessage) => {
      console.log('ĐY"ñ Background message received:', remoteMessage);
      // Background messages are handled when app is in background/quit state
      // The data is processed when the app is opened
    });
    console.log('[RootLayout] Background handler registered');
  }, []);

  return (
    <ErrorBoundary fallbackComponent={RootLayoutErrorFallback}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <PaperProvider>
          <AdminAuthProvider>
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
          </AdminAuthProvider>
        </PaperProvider>
      </GestureHandlerRootView>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  fallbackContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#0f172a',
  },
  fallbackTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#f8fafc',
    marginBottom: 12,
  },
  fallbackMessage: {
    color: '#e0e7ff',
    textAlign: 'center',
    marginBottom: 8,
  },
  fallbackHint: {
    color: '#94a3b8',
    marginBottom: 16,
  },
  fallbackButton: {
    color: '#60a5fa',
    fontSize: 16,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});
