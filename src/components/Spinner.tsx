import React from 'react';
import { ActivityIndicator, StyleSheet, ViewStyle } from 'react-native';
import { colors } from '../utils/styles';

export interface SpinnerProps {
  size?: 'small' | 'large' | number;
  color?: string;
  style?: ViewStyle;
  testID?: string;
}

const Spinner: React.FC<SpinnerProps> = ({
  size = 'large',
  color = colors.indigo600,
  style,
  testID,
}) => {
  return (
    <ActivityIndicator
      size={size}
      color={color}
      style={[styles.spinner, style]}
      testID={testID}
    />
  );
};

const styles = StyleSheet.create({
  spinner: {
    alignSelf: 'center',
  },
});

export default Spinner;
