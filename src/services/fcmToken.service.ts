import apiClient from '../api/apiClient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../utils/constants';

/**
 * FCM Token Service for Admin Mobile App
 * Handles registration and removal of FCM tokens with the backend
 */
class FCMTokenService {
  /**
   * Register FCM token with backend
   * Stores token locally after successful registration
   */
  async registerToken(token: string): Promise<void> {
    try {
      console.log('📤 Registering FCM token with backend...');

      const response = await apiClient.post('/admin/fcm-token', { token });

      if (response.data.success) {
        // Store token locally
        await AsyncStorage.setItem(STORAGE_KEYS.FCM_TOKEN, token);
        console.log('✅ FCM token registered with backend:', response.data);
      } else {
        throw new Error(response.data.message || 'Registration failed');
      }
    } catch (error: any) {
      console.error('❌ Failed to register FCM token with backend:', error);
      throw error;
    }
  }

  /**
   * Remove FCM token from backend (on logout)
   * Also removes token from local storage
   */
  async removeToken(token: string): Promise<void> {
    try {
      console.log('📤 Removing FCM token from backend...');

      await apiClient.delete('/admin/fcm-token', { data: { token } });

      // Remove from local storage
      await AsyncStorage.removeItem(STORAGE_KEYS.FCM_TOKEN);

      console.log('✅ FCM token removed from backend');
    } catch (error: any) {
      console.error('❌ Failed to remove FCM token from backend:', error);
      // Don't throw error - allow logout to continue even if token removal fails
    }
  }

  /**
   * Get stored FCM token from local storage
   */
  async getStoredToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(STORAGE_KEYS.FCM_TOKEN);
    } catch (error) {
      console.error('Failed to get stored FCM token:', error);
      return null;
    }
  }
}

export default new FCMTokenService();
