import { useEffect, useRef } from 'react';
import { Audio } from 'expo-av';
import { Platform } from 'react-native';

export const useAudioNotification = () => {
  const soundRef = useRef<Audio.Sound | null>(null);

  useEffect(() => {
    // Configure audio mode for iOS
    const configureAudio = async () => {
      if (Platform.OS === 'ios') {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
          playsInSilentModeIOS: true,
          staysActiveInBackground: true,
          shouldDuckAndroid: true,
          playThroughEarpieceAndroid: false,
        });
      }
    };

    configureAudio();

    // Cleanup
    return () => {
      if (soundRef.current) {
        soundRef.current.unloadAsync();
      }
    };
  }, []);

  /**
   * Play notification sound for new order
   */
  const playNewOrderSound = async () => {
    try {
      // Unload previous sound if exists
      if (soundRef.current) {
        await soundRef.current.unloadAsync();
      }

      // Load and play sound
      // You'll need to add the sound file to your assets
      const { sound } = await Audio.Sound.createAsync(
        require('../../assets/sounds/new-order.mp3'), // You'll need to add this
        { shouldPlay: true, volume: 1.0 }
      );

      soundRef.current = sound;
    } catch (error) {
      console.error('Error playing new order sound:', error);
    }
  };

  /**
   * Play notification sound for order ready
   */
  const playOrderReadySound = async () => {
    try {
      if (soundRef.current) {
        await soundRef.current.unloadAsync();
      }

      const { sound } = await Audio.Sound.createAsync(
        require('../../assets/sounds/order-ready.mp3'), // You'll need to add this
        { shouldPlay: true, volume: 0.8 }
      );

      soundRef.current = sound;
    } catch (error) {
      console.error('Error playing order ready sound:', error);
    }
  };

  /**
   * Play urgent alert sound
   */
  const playUrgentAlert = async () => {
    try {
      if (soundRef.current) {
        await soundRef.current.unloadAsync();
      }

      const { sound } = await Audio.Sound.createAsync(
        require('../../assets/sounds/urgent-alert.mp3'), // You'll need to add this
        { shouldPlay: true, volume: 1.0, isLooping: false }
      );

      soundRef.current = sound;
    } catch (error) {
      console.error('Error playing urgent alert:', error);
    }
  };

  /**
   * Stop any currently playing sound
   */
  const stopSound = async () => {
    try {
      if (soundRef.current) {
        await soundRef.current.stopAsync();
        await soundRef.current.unloadAsync();
        soundRef.current = null;
      }
    } catch (error) {
      console.error('Error stopping sound:', error);
    }
  };

  return {
    playNewOrderSound,
    playOrderReadySound,
    playUrgentAlert,
    stopSound,
  };
};
