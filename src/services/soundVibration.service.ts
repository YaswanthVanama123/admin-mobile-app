import * as Notifications from 'expo-notifications';
import { Audio } from 'expo-av';
import * as Haptics from 'expo-haptics';

/**
 * Sound & Vibration Service for Admin Mobile App
 * Provides audio and haptic feedback for important events
 */

class SoundVibrationService {
  private sound: Audio.Sound | null = null;
  private soundEnabled = true;
  private vibrationEnabled = true;

  /**
   * Initialize audio settings
   */
  async initialize(): Promise<void> {
    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: true,
        staysActiveInBackground: true,
        shouldDuckAndroid: true,
      });
      console.log('✅ Audio initialized');
    } catch (error) {
      console.error('Failed to initialize audio:', error);
    }
  }

  /**
   * Play new order sound
   * Like Swiggy/Zomato notification sound
   */
  async playNewOrderSound(): Promise<void> {
    if (!this.soundEnabled) return;

    try {
      // Unload previous sound if exists
      if (this.sound) {
        await this.sound.unloadAsync();
      }

      // Load and play notification sound
      const { sound } = await Audio.Sound.createAsync(
        require('../../assets/sounds/new-order.mp3'),
        { shouldPlay: true, volume: 1.0 }
      );

      this.sound = sound;

      // Unload after playing
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          sound.unloadAsync();
        }
      });
    } catch (error) {
      console.error('Failed to play new order sound:', error);
    }
  }

  /**
   * Play success sound (order completed, payment received, etc.)
   */
  async playSuccessSound(): Promise<void> {
    if (!this.soundEnabled) return;

    try {
      const { sound } = await Audio.Sound.createAsync(
        require('../../assets/sounds/success.mp3'),
        { shouldPlay: true, volume: 0.7 }
      );

      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          sound.unloadAsync();
        }
      });
    } catch (error) {
      console.error('Failed to play success sound:', error);
    }
  }

  /**
   * Play error sound
   */
  async playErrorSound(): Promise<void> {
    if (!this.soundEnabled) return;

    try {
      const { sound } = await Audio.Sound.createAsync(
        require('../../assets/sounds/error.mp3'),
        { shouldPlay: true, volume: 0.7 }
      );

      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          sound.unloadAsync();
        }
      });
    } catch (error) {
      console.error('Failed to play error sound:', error);
    }
  }

  /**
   * Vibrate for new order (heavy impact)
   */
  async vibrateNewOrder(): Promise<void> {
    if (!this.vibrationEnabled) return;

    try {
      // Heavy impact vibration pattern
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      setTimeout(async () => {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      }, 200);
    } catch (error) {
      console.error('Failed to vibrate:', error);
    }
  }

  /**
   * Vibrate for success (light impact)
   */
  async vibrateSuccess(): Promise<void> {
    if (!this.vibrationEnabled) return;

    try {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      console.error('Failed to vibrate:', error);
    }
  }

  /**
   * Vibrate for error (medium impact)
   */
  async vibrateError(): Promise<void> {
    if (!this.vibrationEnabled) return;

    try {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } catch (error) {
      console.error('Failed to vibrate:', error);
    }
  }

  /**
   * Vibrate for warning
   */
  async vibrateWarning(): Promise<void> {
    if (!this.vibrationEnabled) return;

    try {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    } catch (error) {
      console.error('Failed to vibrate:', error);
    }
  }

  /**
   * Combined notification: Sound + Vibration for new order
   */
  async notifyNewOrder(): Promise<void> {
    await Promise.all([this.playNewOrderSound(), this.vibrateNewOrder()]);
  }

  /**
   * Combined notification: Sound + Vibration for success
   */
  async notifySuccess(): Promise<void> {
    await Promise.all([this.playSuccessSound(), this.vibrateSuccess()]);
  }

  /**
   * Combined notification: Sound + Vibration for error
   */
  async notifyError(): Promise<void> {
    await Promise.all([this.playErrorSound(), this.vibrateError()]);
  }

  /**
   * Enable/disable sound
   */
  setSoundEnabled(enabled: boolean): void {
    this.soundEnabled = enabled;
  }

  /**
   * Enable/disable vibration
   */
  setVibrationEnabled(enabled: boolean): void {
    this.vibrationEnabled = enabled;
  }

  /**
   * Get current settings
   */
  getSettings(): { soundEnabled: boolean; vibrationEnabled: boolean } {
    return {
      soundEnabled: this.soundEnabled,
      vibrationEnabled: this.vibrationEnabled,
    };
  }

  /**
   * Cleanup
   */
  async cleanup(): Promise<void> {
    if (this.sound) {
      await this.sound.unloadAsync();
    }
  }
}

export const soundVibrationService = new SoundVibrationService();
export default soundVibrationService;
