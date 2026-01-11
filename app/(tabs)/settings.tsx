import { View, StyleSheet } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { router } from 'expo-router';

export default function SettingsScreen() {
  const handleLogout = () => {
    // TODO: Implement logout logic
    router.replace('/login');
  };

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>Settings</Text>

      <Button
        mode="contained"
        onPress={handleLogout}
        style={styles.button}
      >
        Logout
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  title: {
    marginBottom: 20,
  },
  button: {
    marginTop: 20,
  },
});
