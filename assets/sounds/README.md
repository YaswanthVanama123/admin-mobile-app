# Audio Assets for Kitchen Display System

Place the following audio files in this directory:

## Required Files

1. **new-order.mp3** or **new-order.wav**
   - Plays when a new order is received
   - Recommended: Upbeat notification sound (1-2 seconds)
   - Example: Bell chime, ding, or positive alert

2. **order-ready.mp3** or **order-ready.wav**
   - Plays when an order is marked as ready
   - Recommended: Completion sound (1-2 seconds)
   - Example: Success chime, gentle bell

3. **urgent-alert.mp3** or **urgent-alert.wav**
   - Plays when orders exceed 30 minutes
   - Recommended: Attention-grabbing sound (1-2 seconds)
   - Example: Alert beep, urgent chime

## Audio Specifications

- **Format**: MP3 or WAV
- **Bitrate**: 128-192 kbps (MP3)
- **Sample Rate**: 44.1 kHz or 48 kHz
- **Channels**: Mono or Stereo
- **Duration**: 1-3 seconds (keep short)
- **Volume**: Normalize to -3dB to prevent distortion

## Free Sound Resources

You can download free notification sounds from:
- [Zapsplat](https://www.zapsplat.com/)
- [Freesound](https://freesound.org/)
- [Notification Sounds](https://notificationsounds.com/)

## Custom Sounds

To create custom sounds:
1. Use audio editing software (Audacity, GarageBand, etc.)
2. Keep sounds short and distinct
3. Test on actual devices at various volumes
4. Ensure sounds are recognizable in noisy kitchen environments

## Testing

After adding files:
```bash
# Verify files exist
ls -la

# Test audio playback (macOS)
afplay new-order.mp3

# Test audio playback (Linux)
aplay new-order.wav
```

## Note

The audio files are not included in the repository to keep it lightweight. You must add your own audio files according to your preferences and licensing requirements.
