# Unified API Client

A cross-platform API client for Patlinks admin applications that works seamlessly with both React (web) and React Native (mobile).

## Features

- **Cross-platform**: Works with React (Vite/CRA) and React Native (Expo)
- **Type-safe**: Full TypeScript support with comprehensive type definitions
- **Authentication**: Automatic token management with interceptors
- **Multi-tenant**: Restaurant ID header for tenant isolation
- **Error handling**: Global error handling with customizable callbacks
- **Storage abstraction**: Platform-agnostic storage (localStorage/AsyncStorage)
- **Environment config**: Auto-detects environment variables or manual configuration

## Installation

This package is part of the admin-shared-components monorepo package.

```bash
# For React (web)
npm install axios

# For React Native
npm install axios @react-native-async-storage/async-storage
```

## Quick Start

### React (Web)

```typescript
// src/main.tsx or src/index.tsx
import { initializeApi } from '@patlinks/admin-shared-components/api';

// Initialize API client (auto-detects from .env)
initializeApi({
  onUnauthorized: () => {
    window.location.href = '/login';
  },
  onNetworkError: (error) => {
    console.error('Network error:', error);
  },
  debug: true,
});
```

**.env file**:
```env
# Vite
VITE_API_URL=https://api.example.com
VITE_ENVIRONMENT=production

# Create React App
REACT_APP_API_URL=https://api.example.com
REACT_APP_ENVIRONMENT=production
```

### React Native (Mobile)

```typescript
// App.tsx
import { initializeApi, storage, config } from '@patlinks/admin-shared-components/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

// Set storage adapter
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
    navigation.navigate('Login');
  },
  onNetworkError: (error) => {
    Alert.alert('Network Error', 'Please check your connection');
  },
  debug: __DEV__,
});
```

**app.config.js**:
```javascript
export default {
  extra: {
    apiUrl: process.env.API_URL || 'http://localhost:5000',
    environment: process.env.ENVIRONMENT || 'development',
  },
};
```

## Usage Examples

### Authentication

```typescript
import { authApi, storage } from '@patlinks/admin-shared-components/api';

// Login
const login = async (username: string, password: string) => {
  try {
    const { token, admin } = await authApi.login({ username, password });

    // Save auth data
    await storage.setToken(token);
    await storage.setRestaurantId(admin.restaurantId);
    await storage.setAdminData(admin);

    return admin;
  } catch (error) {
    console.error('Login failed:', error);
    throw error;
  }
};

// Logout
const logout = async () => {
  try {
    await authApi.logout();
    await storage.clearAuth();
  } catch (error) {
    console.error('Logout failed:', error);
  }
};

// Get current user
const getCurrentUser = async () => {
  try {
    const admin = await authApi.getCurrentAdmin();
    return admin;
  } catch (error) {
    console.error('Failed to get current user:', error);
    throw error;
  }
};
```

### Menu Items

```typescript
import { menuApi } from '@patlinks/admin-shared-components/api';

// Get all menu items
const menuItems = await menuApi.getAll();

// Get menu items with filters
const vegetarianItems = await menuApi.getAll({
  isVegetarian: true,
  isAvailable: true,
});

// Create menu item with image
const createMenuItem = async (data: MenuItemFormData, imageFile: File) => {
  const newItem = await menuApi.create(data, imageFile);
  return newItem;
};

// Update menu item
const updateMenuItem = async (id: string, data: Partial<MenuItemFormData>) => {
  const updatedItem = await menuApi.update(id, data);
  return updatedItem;
};

// Toggle availability
const toggleAvailability = async (id: string) => {
  const item = await menuApi.toggleAvailability(id);
  return item;
};

// Delete menu item
await menuApi.delete(id);
```

### Orders

```typescript
import { ordersApi } from '@patlinks/admin-shared-components/api';

// Get active orders
const activeOrders = await ordersApi.getActive();

// Get order by ID
const order = await ordersApi.getById(orderId);

// Update order status
const updatedOrder = await ordersApi.updateStatus(orderId, 'preparing');

// Add items to order
const orderWithNewItems = await ordersApi.addItems(orderId, [
  {
    menuItemId: 'item-id',
    name: 'Pizza',
    price: 12.99,
    quantity: 2,
    subtotal: 25.98,
  },
]);

// Get orders with filters
const filteredOrders = await ordersApi.getAll({
  status: 'preparing',
  startDate: '2024-01-01',
  endDate: '2024-01-31',
  page: 1,
  limit: 20,
});
```

### Categories

```typescript
import { categoriesApi } from '@patlinks/admin-shared-components/api';

// Get all categories
const categories = await categoriesApi.getAll();

// Create category
const newCategory = await categoriesApi.create({
  name: 'Appetizers',
  description: 'Start your meal',
  displayOrder: 1,
  isActive: true,
});

// Update category
await categoriesApi.update(categoryId, { name: 'Updated Name' });

// Delete category
await categoriesApi.delete(categoryId);
```

### Tables

```typescript
import { tablesApi } from '@patlinks/admin-shared-components/api';

// Get all tables
const tables = await tablesApi.getAll();

// Get occupied tables
const occupiedTables = await tablesApi.getOccupied();

// Get available tables
const availableTables = await tablesApi.getAvailable();

// Mark table as occupied
await tablesApi.markOccupied(tableId, orderId);

// Mark table as available
await tablesApi.markAvailable(tableId);
```

### Analytics

```typescript
import { analyticsApi } from '@patlinks/admin-shared-components/api';

// Get analytics page data (optimized)
const analytics = await analyticsApi.getPageData({
  startDate: '2024-01-01',
  endDate: '2024-01-31',
});

// Get revenue data
const revenue = await analyticsApi.getRevenue({
  startDate: '2024-01-01',
  endDate: '2024-01-31',
});

// Get popular items
const popularItems = await analyticsApi.getPopularItems({
  startDate: '2024-01-01',
  endDate: '2024-01-31',
});

// Export analytics data
const blob = await analyticsApi.exportData('revenue', {
  startDate: '2024-01-01',
  endDate: '2024-01-31',
}, 'csv');
```

### Dashboard

```typescript
import { dashboardApi } from '@patlinks/admin-shared-components/api';

// Get dashboard page data (optimized - single request)
const { stats, activeOrders } = await dashboardApi.getPageData();

console.log('Today Orders:', stats.todayOrders);
console.log('Active Orders:', activeOrders);
```

### Settings

```typescript
import { settingsApi } from '@patlinks/admin-shared-components/api';

// Get restaurant settings
const restaurant = await settingsApi.getRestaurant();

// Update restaurant settings
const updated = await settingsApi.updateRestaurant({
  name: 'My Restaurant',
  settings: {
    taxRate: 0.08,
    currency: 'USD',
  },
});

// Upload logo
const logoFile = new File([...], 'logo.png', { type: 'image/png' });
const { logoUrl } = await settingsApi.uploadLogo(logoFile);
```

### File Upload

```typescript
import { uploadApi } from '@patlinks/admin-shared-components/api';

// Upload single file
const uploadFile = async (file: File) => {
  const result = await uploadApi.uploadFile(file, 'menu-items');
  console.log('Uploaded:', result.url);
  return result;
};

// Upload image with optimization
const uploadImage = async (imageFile: File) => {
  const result = await uploadApi.uploadImage(imageFile, {
    folder: 'menu-items',
    resize: true,
    width: 800,
    height: 600,
  });
  return result;
};

// Upload multiple files
const uploadMultiple = async (files: File[]) => {
  const results = await uploadApi.uploadFiles(files, 'documents');
  return results;
};
```

## API Modules

- **authApi**: Authentication (login, logout, verify, password reset)
- **menuApi**: Menu items CRUD and management
- **categoriesApi**: Category CRUD and management
- **tablesApi**: Table management and status
- **ordersApi**: Order CRUD, status updates, and history
- **analyticsApi**: Analytics and reporting
- **dashboardApi**: Dashboard statistics and data
- **kitchenApi**: Kitchen display and order preparation
- **addOnsApi**: Add-ons management
- **settingsApi**: Restaurant and system settings
- **uploadApi**: File and image uploads

## Storage Management

The storage utility provides a platform-agnostic interface for storing data.

```typescript
import { storage } from '@patlinks/admin-shared-components/api';

// Token management
await storage.setToken('jwt-token');
const token = await storage.getToken();
await storage.removeToken();

// Restaurant ID
await storage.setRestaurantId('restaurant-id');
const restaurantId = await storage.getRestaurantId();

// Admin data
await storage.setAdminData({ id: '1', name: 'Admin' });
const adminData = await storage.getAdminData();

// Clear all auth data
await storage.clearAuth();
```

## Configuration

```typescript
import { config } from '@patlinks/admin-shared-components/api';

// Get configuration
const apiUrl = config.getApiUrl();
const environment = config.getEnvironment();
const isDebug = config.isDebug();

// Check environment
if (config.isProduction()) {
  // Production-specific code
}

if (config.isDevelopment()) {
  // Development-specific code
}

// Manually set config (useful for React Native)
config.setConfig({
  apiUrl: 'https://api.example.com',
  environment: 'production',
  debug: false,
});
```

## Error Handling

All API calls return promises that can be caught with try/catch:

```typescript
import { menuApi } from '@patlinks/admin-shared-components/api';

try {
  const menuItems = await menuApi.getAll();
  // Handle success
} catch (error) {
  // Handle error
  if (error.response?.status === 401) {
    // Unauthorized - redirect to login
  } else if (error.response?.status === 404) {
    // Not found
  } else if (!error.response) {
    // Network error
  } else {
    // Other errors
  }
}
```

## TypeScript Types

All types are exported from the main index:

```typescript
import type {
  Admin,
  MenuItem,
  Order,
  Category,
  Table,
  ApiResponse,
  OrderStatus,
  // ... and more
} from '@patlinks/admin-shared-components/api';
```

## Best Practices

1. **Initialize once**: Call `initializeApi()` once at app startup
2. **Use storage helpers**: Use `storage.setToken()` instead of direct storage access
3. **Handle errors**: Always wrap API calls in try/catch
4. **Type safety**: Use TypeScript types for better development experience
5. **Optimize requests**: Use optimized endpoints like `getPageData()` when available

## Troubleshooting

### "API Client not initialized" error

Make sure to call `initializeApi()` before making any API calls:

```typescript
import { initializeApi } from '@patlinks/admin-shared-components/api';

initializeApi();
```

### "Storage adapter not initialized" error (React Native)

Set the storage adapter before initializing the API:

```typescript
import { storage } from '@patlinks/admin-shared-components/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

storage.setAdapter(AsyncStorage);
```

### Environment variables not working

**For Vite**: Use `VITE_` prefix (e.g., `VITE_API_URL`)
**For CRA**: Use `REACT_APP_` prefix (e.g., `REACT_APP_API_URL`)
**For React Native**: Use `app.config.js` with `extra` field

## License

MIT
