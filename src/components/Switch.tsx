import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, ViewStyle } from 'react-native';
import { colors, spacing, fontSize, fontWeight } from '../utils/styles';

export interface SwitchProps {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
  label?: string;
  error?: string;
  helperText?: string;
  disabled?: boolean;
  containerStyle?: ViewStyle;
  testID?: string;
}

const Switch: React.FC<SwitchProps> = ({
  enabled,
  onChange,
  label,
  error,
  helperText,
  disabled = false,
  containerStyle,
  testID,
}) => {
  const animatedValue = React.useRef(new Animated.Value(enabled ? 1 : 0)).current;

  React.useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: enabled ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [enabled, animatedValue]);

  const translateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [2, 22],
  });

  const handlePress = () => {
    if (!disabled) {
      onChange(!enabled);
    }
  };

  return (
    <View style={[styles.container, containerStyle]}>
      <View style={styles.switchRow}>
        <TouchableOpacity
          style={[
            styles.switch,
            enabled ? styles.switchEnabled : styles.switchDisabled,
            disabled && styles.switchDisabledState,
          ]}
          onPress={handlePress}
          disabled={disabled}
          activeOpacity={0.8}
          testID={testID}
        >
          <Animated.View
            style={[
              styles.thumb,
              {
                transform: [{ translateX }],
              },
            ]}
          />
        </TouchableOpacity>
        {label && (
          <Text style={[styles.label, disabled && styles.labelDisabled]}>{label}</Text>
        )}
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
      {helperText && !error && <Text style={styles.helperText}>{helperText}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  switch: {
    width: 44,
    height: 24,
    borderRadius: 12,
    padding: 2,
    justifyContent: 'center',
  },
  switchEnabled: {
    backgroundColor: colors.indigo600,
  },
  switchDisabled: {
    backgroundColor: colors.gray300,
  },
  switchDisabledState: {
    opacity: 0.5,
  },
  thumb: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.white,
  },
  label: {
    marginLeft: spacing.md - 4,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    color: colors.gray700,
  },
  labelDisabled: {
    color: colors.gray400,
  },
  errorText: {
    marginTop: spacing.xs,
    fontSize: fontSize.sm,
    color: colors.red600,
  },
  helperText: {
    marginTop: spacing.xs,
    fontSize: fontSize.sm,
    color: colors.gray500,
  },
});

export default Switch;
