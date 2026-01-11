import React from 'react';
import { View, TextInput, Text, StyleSheet, TextInputProps, ViewStyle } from 'react-native';
import { colors, spacing, borderRadius, fontSize, fontWeight } from '../utils/styles';

export interface TextAreaProps extends Omit<TextInputProps, 'style'> {
  label?: string;
  error?: string;
  helperText?: string;
  containerStyle?: ViewStyle;
  inputStyle?: ViewStyle;
  rows?: number;
}

const TextArea: React.FC<TextAreaProps> = ({
  label,
  error,
  helperText,
  containerStyle,
  inputStyle,
  rows = 4,
  ...props
}) => {
  const minHeight = rows * 20 + spacing.md * 2;

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        style={[
          styles.textArea,
          { minHeight },
          error && styles.textAreaError,
          inputStyle,
        ]}
        multiline
        numberOfLines={rows}
        textAlignVertical="top"
        placeholderTextColor={colors.gray400}
        {...props}
      />
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
  textArea: {
    borderWidth: 2,
    borderColor: colors.gray300,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md - 4,
    fontSize: fontSize.base,
    color: colors.gray900,
    backgroundColor: colors.white,
  },
  textAreaError: {
    borderColor: colors.red300,
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

export default TextArea;
