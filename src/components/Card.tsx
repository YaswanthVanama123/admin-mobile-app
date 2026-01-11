import React from 'react';
import { View, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { colors, spacing, borderRadius, shadows } from '../utils/styles';

export interface CardProps {
  children: React.ReactNode;
  hover?: boolean;
  onPress?: () => void;
  style?: ViewStyle;
  testID?: string;
}

const Card: React.FC<CardProps> = ({ children, hover = false, onPress, style, testID }) => {
  if (onPress || hover) {
    return (
      <TouchableOpacity
        style={[styles.card, style]}
        onPress={onPress}
        activeOpacity={0.9}
        testID={testID}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return (
    <View style={[styles.card, style]} testID={testID}>
      {children}
    </View>
  );
};

export const CardHeader: React.FC<{ children: React.ReactNode; style?: ViewStyle }> = ({
  children,
  style,
}) => {
  return <View style={[styles.header, style]}>{children}</View>;
};

export const CardBody: React.FC<{ children: React.ReactNode; style?: ViewStyle }> = ({
  children,
  style,
}) => {
  return <View style={[styles.body, style]}>{children}</View>;
};

export const CardFooter: React.FC<{ children: React.ReactNode; style?: ViewStyle }> = ({
  children,
  style,
}) => {
  return <View style={[styles.footer, style]}>{children}</View>;
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.xl,
    ...shadows.lg,
  },
  header: {
    paddingHorizontal: spacing.xl - 8,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray200,
  },
  body: {
    paddingHorizontal: spacing.xl - 8,
    paddingVertical: spacing.md,
  },
  footer: {
    paddingHorizontal: spacing.xl - 8,
    paddingVertical: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.gray200,
    backgroundColor: colors.gray50,
    borderBottomLeftRadius: borderRadius.xl,
    borderBottomRightRadius: borderRadius.xl,
  },
});

export default Card;
