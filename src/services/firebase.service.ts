import messaging from '@react-native-firebase/messaging';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';

/**
 * Firebase Cloud Messaging Service for Admin Mobile App
 * Handles push notifications for new orders and order updates
 */
class FirebaseService {
  private initialized = false;

  /**
   * Initialize Firebase and request notification permissions
   * Returns FCM token if successful, null otherwise
   */
  async initialize(): Promise<string | null> {
    try {
      // Request permissions
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (!enabled) {
        console.warn('Push notification permission denied');
        return null;
      }

      // Configure notification handler for Expo Notifications
      Notifications.setNotificationHandler({
        handleNotification: async () => ({
          shouldShowAlert: true,
          shouldPlaySound: true,
          shouldSetBadge: true,
        }),
      });

      // Get FCM token
      const token = await messaging().getToken();
      console.log('✅ FCM Token obtained:', token.substring(0, 20) + '...');

      this.initialized = true;
      return token;
    } catch (error) {
      console.error('Failed to initialize Firebase:', error);
      return null;
    }
  }

  /**
   * Get current FCM token
   */
  async getToken(): Promise<string | null> {
    try {
      if (!this.initialized) {
        return await this.initialize();
      }
      return await messaging().getToken();
    } catch (error) {
      console.error('Failed to get FCM token:', error);
      return null;
    }
  }

  /**
   * Listen for foreground notifications
   * Called when app is in foreground and notification is received
   */
  onMessageReceived(callback: (remoteMessage: any) => void): () => void {
    const unsubscribe = messaging().onMessage((remoteMessage) => {
      console.log('📱 Foreground notification received:', remoteMessage);
      callback(remoteMessage);
    });

    return unsubscribe;
  }

  /**
   * Set background message handler
   * Called when app is in background/quit and notification is received
   */
  setBackgroundMessageHandler(handler: (remoteMessage: any) => Promise<void>): void {
    messaging().setBackgroundMessageHandler(handler);
  }

  /**
   * Listen for notification taps (when user opens app from notification)
   * Returns unsubscribe function
   */
  onNotificationOpened(callback: (remoteMessage: any) => void): () => void {
    // Handle initial notification (app opened from quit state)
    messaging()
      .getInitialNotification()
      .then((remoteMessage) => {
        if (remoteMessage) {
          console.log('📱 App opened from quit state by notification:', remoteMessage);
          callback(remoteMessage);
        }
      });

    // Handle notification tap when app is in background
    const unsubscribe = messaging().onNotificationOpenedApp((remoteMessage) => {
      console.log('📱 App opened from background by notification:', remoteMessage);
      callback(remoteMessage);
    });

    return unsubscribe;
  }

  /**
   * Delete FCM token (on logout)
   */
  async deleteToken(): Promise<void> {
    try {
      await messaging().deleteToken();
      this.initialized = false;
      console.log('✅ FCM token deleted');
    } catch (error) {
      console.error('Failed to delete FCM token:', error);
    }
  }

  /**
   * Check if Firebase is initialized
   */
  isInitialized(): boolean {
    return this.initialized;
  }
}

export default new FirebaseService();
