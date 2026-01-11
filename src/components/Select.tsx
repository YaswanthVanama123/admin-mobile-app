import React from 'react';
import { View, Text, StyleSheet, ViewStyle, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { colors, spacing, borderRadius, fontSize, fontWeight } from '../utils/styles';

export interface SelectOption {
  value: string | number;
  label: string;
}

export interface SelectProps {
  label?: string;
  error?: string;
  helperText?: string;
  placeholder?: string;
  options: SelectOption[];
  value?: string | number;
  onValueChange?: (value: string | number) => void;
  disabled?: boolean;
  containerStyle?: ViewStyle;
  testID?: string;
}

const Select: React.FC<SelectProps> = ({
  label,
  error,
  helperText,
  placeholder,
  options,
  value,
  onValueChange,
  disabled = false,
  containerStyle,
  testID,
}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={[styles.pickerWrapper, error && styles.pickerWrapperError]}>
        <Picker
          selectedValue={value}
          onValueChange={onValueChange}
          enabled={!disabled}
          style={[
            styles.picker,
            disabled && styles.pickerDisabled,
            Platform.OS === 'ios' && styles.pickerIOS,
          ]}
          testID={testID}
        >
          {placeholder && (
            <Picker.Item label={placeholder} value="" enabled={false} />
          )}
          {options.map((option) => (
            <Picker.Item
              key={option.value}
              label={option.label}
              value={option.value}
            />
          ))}
        </Picker>
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
  label: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    color: colors.gray700,
    marginBottom: spacing.sm,
  },
  pickerWrapper: {
    borderWidth: 2,
    borderColor: colors.gray300,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.white,
    overflow: 'hidden',
  },
  pickerWrapperError: {
    borderColor: colors.red300,
  },
  picker: {
    height: 50,
    width: '100%',
    color: colors.gray900,
  },
  pickerIOS: {
    paddingHorizontal: spacing.md,
  },
  pickerDisabled: {
    backgroundColor: colors.gray100,
    opacity: 0.6,
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

export default Select;
