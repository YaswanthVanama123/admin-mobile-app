import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';

export default function ProductsScreen() {
  return (
    <View style={styles.container}>
      <Text variant="headlineMedium">Products</Text>
      <Text variant="bodyMedium" style={styles.subtitle}>
        Product management coming soon
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
