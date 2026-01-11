import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { colors, spacing, borderRadius, fontSize, fontWeight } from '../utils/styles';

export interface CheckboxProps {
  label?: string;
  error?: string;
  helperText?: string;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  containerStyle?: ViewStyle;
  testID?: string;
}

const Checkbox: React.FC<CheckboxProps> = ({
  label,
  error,
  helperText,
  checked = false,
  onChange,
  disabled = false,
  containerStyle,
  testID,
}) => {
  const handlePress = () => {
    if (!disabled && onChange) {
      onChange(!checked);
    }
  };

  return (
    <View style={[styles.container, containerStyle]}>
      <View style={styles.checkboxRow}>
        <TouchableOpacity
          style={[
            styles.checkbox,
            checked && styles.checkboxChecked,
            error && styles.checkboxError,
            disabled && styles.checkboxDisabled,
          ]}
          onPress={handlePress}
          disabled={disabled}
          activeOpacity={0.7}
          testID={testID}
        >
          {checked && <Text style={styles.checkmark}>✓</Text>}
        </TouchableOpacity>
        {label && (
          <TouchableOpacity
            onPress={handlePress}
            disabled={disabled}
            activeOpacity={0.7}
            style={styles.labelContainer}
          >
            <Text style={[styles.label, disabled && styles.labelDisabled]}>{label}</Text>
          </TouchableOpacity>
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
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: colors.gray300,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: colors.indigo600,
    borderColor: colors.indigo600,
  },
  checkboxError: {
    borderColor: colors.red300,
  },
  checkboxDisabled: {
    backgroundColor: colors.gray100,
    opacity: 0.6,
  },
  checkmark: {
    color: colors.white,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.bold,
  },
  labelContainer: {
    flex: 1,
    marginLeft: spacing.md - 4,
  },
  label: {
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

export default Checkbox;
