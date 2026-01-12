import { registerRootComponent } from 'expo';
import messaging from '@react-native-firebase/messaging';

import App from './App';

/**
 * Background message handler for Firebase Cloud Messaging
 * This must be registered at the root level (not inside React components)
 * Handles notifications when app is in background or quit state
 */
messaging().setBackgroundMessageHandler(async (remoteMessage) => {
  console.log('📱 Background message received at root level:', remoteMessage);

  // You can perform background tasks here
  // For example: fetch data, update local storage, etc.
  // Note: UI updates should be done when the app comes to foreground
});

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
