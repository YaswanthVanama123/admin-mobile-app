import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';

export default function OrdersScreen() {
  return (
    <View style={styles.container}>
      <Text variant="headlineMedium">Orders</Text>
      <Text variant="bodyMedium" style={styles.subtitle}>
        Order management coming soon
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  subtitle: {
    marginTop: 10,
    color: '#666',
  },
});
