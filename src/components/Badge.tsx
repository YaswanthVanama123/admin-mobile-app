import React from 'react';
import { Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { colors, spacing, borderRadius, fontSize, fontWeight } from '../utils/styles';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info' | 'gray';
  size?: 'sm' | 'md' | 'lg';
  style?: ViewStyle;
}

const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  style,
}) => {
  const badgeStyle = [
    styles.base,
    styles[variant],
    styles[`size_${size}`],
    style,
  ] as ViewStyle[];

  const textStyle = [
    styles.text,
    styles[`textSize_${size}`],
  ] as TextStyle[];

  return <Text style={badgeStyle}>{children}</Text>;
};

const styles = StyleSheet.create({
  base: {
    alignSelf: 'flex-start',
    borderRadius: borderRadius.full,
    borderWidth: 1,
    fontWeight: fontWeight.medium,
  },
  // Variants
  primary: {
    backgroundColor: colors.indigo100,
    color: colors.indigo800,
    borderColor: colors.indigo200,
  },
  secondary: {
    backgroundColor: colors.purple100,
    color: colors.purple800,
    borderColor: colors.purple200,
  },
  success: {
    backgroundColor: colors.green100,
    color: colors.green800,
    borderColor: colors.green200,
  },
  warning: {
    backgroundColor: colors.yellow100,
    color: colors.yellow800,
    borderColor: colors.yellow200,
  },
  danger: {
    backgroundColor: colors.red100,
    color: colors.red800,
    borderColor: colors.red200,
  },
  info: {
    backgroundColor: colors.blue100,
    color: colors.blue800,
    borderColor: colors.blue200,
  },
  gray: {
    backgroundColor: colors.gray100,
    color: colors.gray800,
    borderColor: colors.gray200,
  },
  // Sizes
  size_sm: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs / 2,
  },
  size_md: {
    paddingHorizontal: spacing.md - 4,
    paddingVertical: spacing.xs,
  },
  size_lg: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
  },
  // Text styles
  text: {
    fontWeight: fontWeight.medium,
  },
  textSize_sm: {
    fontSize: fontSize.xs,
  },
  textSize_md: {
    fontSize: fontSize.sm,
  },
  textSize_lg: {
    fontSize: fontSize.base,
  },
});

export default Badge;
