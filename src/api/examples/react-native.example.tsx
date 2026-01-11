/**
 * React Native (Mobile) Example Usage
 * This file demonstrates how to use the unified API client in a React Native application
 */

// App.tsx
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import {
  initializeApi,
  storage,
  config,
  authApi,
  menuApi,
  ordersApi,
} from '@patlinks/admin-shared-components/api';
import type { Admin, MenuItem, Order } from '@patlinks/admin-shared-components/api';

// Initialize storage adapter (IMPORTANT: Do this before initializing API)
storage.setAdapter(AsyncStorage);

// Set configuration
config.setConfig({
  apiUrl: Constants.expoConfig?.extra?.apiUrl || 'http://localhost:5000',
  environment: Constants.expoConfig?.extra?.environment || 'development',
  debug: __DEV__,
});

// Initialize API client
initializeApi({
  onUnauthorized: () => {
    // Navigate to login screen
    // Note: You'll need to use navigation ref for this
    Alert.alert('Session Expired', 'Please login again');
  },
  onNetworkError: (error) => {
    Alert.alert('Network Error', 'Please check your internet connection');
  },
  debug: __DEV__,
});

// Example: Login Screen
function LoginScreen({ navigation }: any) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert('Error', 'Please enter username and password');
      return;
    }

    setLoading(true);

    try {
      const { token, admin } = await authApi.login({ username, password });

      // Save auth data
      await storage.setToken(token);
      await storage.setRestaurantId(admin.restaurantId);
      await storage.setAdminData(admin);

      // Navigate to main app
      navigation.replace('Dashboard');
    } catch (err: any) {
      Alert.alert(
        'Login Failed',
        err.response?.data?.message || 'Invalid credentials'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Admin Login</Text>

      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
        editable={!loading}
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        editable={!loading}
      />

      <Button title={loading ? 'Logging in...' : 'Login'} onPress={handleLogin} disabled={loading} />
    </View>
  );
}

// Example: Menu Items Screen
function MenuItemsScreen() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadMenuItems();
  }, []);

  const loadMenuItems = async () => {
    try {
      const items = await menuApi.getAll();
      setMenuItems(items);
    } catch (err: any) {
      Alert.alert('Error', 'Failed to load menu items');
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadMenuItems();
  };

  const handleToggleAvailability = async (id: string) => {
    try {
      const updatedItem = await menuApi.toggleAvailability(id);
      setMenuItems((items) =>
        items.map((item) => (item._id === id ? updatedItem : item))
      );
    } catch (err) {
      Alert.alert('Error', 'Failed to toggle availability');
    }
  };

  const handleDelete = async (id: string) => {
    Alert.alert(
      'Delete Item',
      'Are you sure you want to delete this item?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await menuApi.delete(id);
              setMenuItems((items) => items.filter((item) => item._id !== id));
            } catch (err) {
              Alert.alert('Error', 'Failed to delete item');
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={menuItems}
        keyExtractor={(item) => item._id}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        renderItem={({ item }) => (
          <View style={styles.menuItemCard}>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemDescription}>{item.description}</Text>
            <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>
            <Text style={styles.itemStatus}>
              {item.isAvailable ? 'Available' : 'Unavailable'}
            </Text>
            <View style={styles.itemActions}>
              <TouchableOpacity
                style={styles.button}
                onPress={() => handleToggleAvailability(item._id)}
              >
                <Text style={styles.buttonText}>Toggle</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.deleteButton]}
                onPress={() => handleDelete(item._id)}
              >
                <Text style={styles.buttonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.centerContainer}>
            <Text>No menu items found</Text>
          </View>
        }
      />
    </View>
  );
}

// Example: Orders Screen
function OrdersScreen() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();

    // Poll for new orders every 5 seconds
    const interval = setInterval(loadOrders, 5000);
    return () => clearInterval(interval);
  }, []);

  const loadOrders = async () => {
    try {
      const activeOrders = await ordersApi.getActive();
      setOrders(activeOrders);
    } catch (err) {
      console.error('Failed to load orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (orderId: string, status: any) => {
    try {
      const updatedOrder = await ordersApi.updateStatus(orderId, status);
      setOrders((orders) =>
        orders.map((order) => (order._id === orderId ? updatedOrder : order))
      );
    } catch (err) {
      Alert.alert('Error', 'Failed to update order status');
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={orders}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.orderCard}>
            <Text style={styles.orderNumber}>Order #{item.orderNumber}</Text>
            <Text>Table: {item.tableNumber}</Text>
            <Text>Status: {item.status}</Text>
            <Text>Total: ${item.total.toFixed(2)}</Text>
            <View style={styles.orderItems}>
              {item.items.map((orderItem, index) => (
                <Text key={index}>
                  {orderItem.quantity}x {orderItem.name}
                </Text>
              ))}
            </View>
            <View style={styles.orderActions}>
              <Button
                title="Preparing"
                onPress={() => handleUpdateStatus(item._id, 'preparing')}
              />
              <Button
                title="Ready"
                onPress={() => handleUpdateStatus(item._id, 'ready')}
              />
              <Button
                title="Served"
                onPress={() => handleUpdateStatus(item._id, 'served')}
              />
            </View>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.centerContainer}>
            <Text>No active orders</Text>
          </View>
        }
      />
    </View>
  );
}

// Example: Dashboard Screen
function DashboardScreen({ navigation }: any) {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    try {
      const adminData = await storage.getAdminData();
      setAdmin(adminData);
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          try {
            await authApi.logout();
            await storage.clearAuth();
            navigation.replace('Login');
          } catch (err) {
            console.error('Logout failed:', err);
          }
        },
      },
    ]);
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome, {admin?.username}</Text>
      <Text>Role: {admin?.role}</Text>
      <Text>Restaurant ID: {admin?.restaurantId}</Text>

      <View style={styles.dashboardButtons}>
        <Button title="Menu Items" onPress={() => navigation.navigate('MenuItems')} />
        <Button title="Orders" onPress={() => navigation.navigate('Orders')} />
        <Button title="Logout" onPress={handleLogout} color="red" />
      </View>
    </View>
  );
}

// Navigation Setup
const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Dashboard" component={DashboardScreen} />
        <Stack.Screen name="MenuItems" component={MenuItemsScreen} />
        <Stack.Screen name="Orders" component={OrdersScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  menuItemCard: {
    padding: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 12,
  },
  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  itemDescription: {
    color: '#666',
    marginTop: 4,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007AFF',
    marginTop: 8,
  },
  itemStatus: {
    marginTop: 4,
    color: '#666',
  },
  itemActions: {
    flexDirection: 'row',
    marginTop: 12,
    gap: 8,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 8,
    borderRadius: 4,
    flex: 1,
  },
  deleteButton: {
    backgroundColor: '#FF3B30',
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  orderCard: {
    padding: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 12,
  },
  orderNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  orderItems: {
    marginTop: 8,
    marginBottom: 12,
  },
  orderActions: {
    flexDirection: 'row',
    gap: 8,
  },
  dashboardButtons: {
    marginTop: 24,
    gap: 12,
  },
});
