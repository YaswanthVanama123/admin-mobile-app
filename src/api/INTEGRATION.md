# Unified API Client - Integration Guide

This guide will help you integrate the unified API client into your React (web) and React Native (mobile) applications.

## File Structure

```
/packages/admin-shared-components/src/api/
├── index.ts                    # Main entry point with initializeApi()
├── client.ts                   # Axios client with interceptors
├── storage.ts                  # Platform-agnostic storage utility
├── config.ts                   # Environment configuration
├── types.ts                    # TypeScript type definitions
├── auth.api.ts                 # Authentication endpoints
├── menu.api.ts                 # Menu items endpoints
├── categories.api.ts           # Categories endpoints
├── tables.api.ts               # Tables endpoints
├── orders.api.ts               # Orders endpoints
├── analytics.api.ts            # Analytics endpoints
├── dashboard.api.ts            # Dashboard endpoints
├── kitchen.api.ts              # Kitchen display endpoints
├── addons.api.ts               # Add-ons endpoints
├── settings.api.ts             # Settings endpoints
├── upload.api.ts               # File upload endpoints
├── README.md                   # Complete documentation
└── examples/
    ├── react-web.example.tsx      # React web examples
    └── react-native.example.tsx   # React Native examples
```

## Integration Steps

### For React Web Applications (admin-app, admin-desktop-app)

#### 1. Update .env file

```env
# Vite
VITE_API_URL=http://localhost:5000
VITE_ENVIRONMENT=development
VITE_DEBUG=true

# Or for Create React App
REACT_APP_API_URL=http://localhost:5000
REACT_APP_ENVIRONMENT=development
REACT_APP_DEBUG=true
```

#### 2. Initialize API in main.tsx or App.tsx

```typescript
// src/main.tsx
import { initializeApi } from '@patlinks/admin-shared-components/api';

// Initialize once at app startup
initializeApi({
  onUnauthorized: () => {
    window.location.href = '/login';
  },
  onNetworkError: (error) => {
    console.error('Network error:', error);
    // Show toast notification
  },
  debug: import.meta.env.MODE === 'development',
});
```

#### 3. Replace existing API imports

**Before:**
```typescript
import { authApi } from '../api/auth.api';
import { menuApi } from '../api/menu.api';
```

**After:**
```typescript
import { authApi, menuApi } from '@patlinks/admin-shared-components/api';
```

#### 4. Update storage usage

**Before:**
```typescript
localStorage.setItem('adminToken', token);
localStorage.getItem('adminToken');
localStorage.removeItem('adminToken');
```

**After:**
```typescript
import { storage } from '@patlinks/admin-shared-components/api';

await storage.setToken(token);
await storage.getToken();
await storage.removeToken();
```

### For React Native Applications

#### 1. Install required dependencies

```bash
npm install @react-native-async-storage/async-storage
npm install @react-navigation/native @react-navigation/native-stack
npm install expo-constants  # if using Expo
```

#### 2. Configure app.config.js

```javascript
// app.config.js
export default {
  name: "Admin Mobile App",
  extra: {
    apiUrl: process.env.API_URL || 'http://localhost:5000',
    environment: process.env.ENVIRONMENT || 'development',
  },
};
```

#### 3. Initialize API in App.tsx

```typescript
// App.tsx
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { initializeApi, storage, config } from '@patlinks/admin-shared-components/api';

// IMPORTANT: Set storage adapter first
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
    navigationRef.current?.navigate('Login');
  },
  onNetworkError: (error) => {
    Alert.alert('Network Error', 'Please check your connection');
  },
  debug: __DEV__,
});
```

#### 4. Use API in components

```typescript
import { authApi, menuApi, ordersApi } from '@patlinks/admin-shared-components/api';

// Login
const { token, admin } = await authApi.login({ username, password });
await storage.setToken(token);

// Get menu items
const menuItems = await menuApi.getAll();

// Get orders
const orders = await ordersApi.getActive();
```

## Migration Guide

### Step 1: Update package.json

Add axios to dependencies if not already present:

```json
{
  "dependencies": {
    "axios": "^1.6.0"
  }
}
```

For React Native, also add:
```json
{
  "dependencies": {
    "@react-native-async-storage/async-storage": "^1.21.0"
  }
}
```

### Step 2: Remove old API files

After confirming the new API works, you can remove the old API files from your project:

```bash
# For admin-app
rm -rf src/api/

# For mobile app
rm -rf src/api/
```

### Step 3: Update imports across the project

Use find and replace to update all imports:

**Find:**
```typescript
from '../api/
from '@/api/
```

**Replace with:**
```typescript
from '@patlinks/admin-shared-components/api'
```

### Step 4: Update storage calls

Search for all `localStorage` usage and replace with `storage`:

**Find:**
```typescript
localStorage.setItem(STORAGE_KEYS.ADMIN_TOKEN, token)
localStorage.getItem(STORAGE_KEYS.ADMIN_TOKEN)
localStorage.removeItem(STORAGE_KEYS.ADMIN_TOKEN)
```

**Replace with:**
```typescript
await storage.setToken(token)
await storage.getToken()
await storage.removeToken()
```

### Step 5: Test authentication flow

1. Test login
2. Test token persistence
3. Test automatic logout on 401
4. Test API calls with authentication

### Step 6: Test all API endpoints

Create a test checklist:
- [ ] Auth: login, logout, getCurrentAdmin
- [ ] Menu: getAll, create, update, delete
- [ ] Categories: getAll, create, update, delete
- [ ] Tables: getAll, getOccupied, getAvailable
- [ ] Orders: getActive, updateStatus, addItems
- [ ] Analytics: getPageData, getRevenue
- [ ] Dashboard: getPageData
- [ ] Upload: uploadImage, uploadFile

## Common Issues and Solutions

### Issue 1: "API Client not initialized"

**Solution:** Make sure `initializeApi()` is called before any API calls:

```typescript
import { initializeApi } from '@patlinks/admin-shared-components/api';

initializeApi();
```

### Issue 2: "Storage adapter not initialized" (React Native)

**Solution:** Set the storage adapter before initializing API:

```typescript
import AsyncStorage from '@react-native-async-storage/async-storage';
import { storage } from '@patlinks/admin-shared-components/api';

storage.setAdapter(AsyncStorage);
```

### Issue 3: Environment variables not loading

**For Vite:**
- Use `VITE_` prefix
- Restart dev server after changing .env

**For React Native:**
- Use app.config.js with `extra` field
- Rebuild the app after changes

### Issue 4: FormData not working in React Native

**Solution:** Use the correct FormData implementation:

```typescript
// React Native uses a different FormData
const formData = new FormData();
formData.append('image', {
  uri: imageUri,
  type: 'image/jpeg',
  name: 'photo.jpg',
} as any);
```

## Best Practices

1. **Initialize once:** Call `initializeApi()` only once at app startup
2. **Use TypeScript:** Import and use type definitions for better DX
3. **Error handling:** Always wrap API calls in try/catch blocks
4. **Storage:** Use `storage` utility instead of direct localStorage/AsyncStorage
5. **Async/await:** Always use async/await for storage operations
6. **Debug mode:** Enable debug mode during development for better logging
7. **Optimize requests:** Use optimized endpoints like `getPageData()` when available

## Performance Tips

1. **Use optimized endpoints:**
   - `menuApi.getPageData()` instead of separate calls
   - `dashboardApi.getPageData()` instead of multiple requests
   - `analyticsApi.getPageData()` instead of individual analytics calls

2. **Implement caching:**
   ```typescript
   let cachedMenuItems: MenuItem[] | null = null;

   const getMenuItems = async () => {
     if (cachedMenuItems) return cachedMenuItems;
     cachedMenuItems = await menuApi.getAll();
     return cachedMenuItems;
   };
   ```

3. **Use polling wisely:**
   ```typescript
   useEffect(() => {
     loadOrders();
     const interval = setInterval(loadOrders, 5000);
     return () => clearInterval(interval);
   }, []);
   ```

## Security Considerations

1. **Token storage:** Tokens are stored securely in localStorage (web) or AsyncStorage (mobile)
2. **Auto-logout:** API client automatically logs out on 401/403 with token errors
3. **Multi-tenant:** Restaurant ID is sent with every request for data isolation
4. **HTTPS:** Always use HTTPS in production
5. **Token refresh:** Implement token refresh if supported by backend

## Next Steps

1. Read the [Complete API Documentation](./README.md)
2. Check out [React Web Examples](./examples/react-web.example.tsx)
3. Check out [React Native Examples](./examples/react-native.example.tsx)
4. Test integration in your development environment
5. Deploy to staging and test thoroughly
6. Roll out to production

## Support

For issues or questions:
1. Check the README.md for detailed API documentation
2. Review the example files in the examples/ folder
3. Check the TypeScript types in types.ts
4. Contact the development team

---

**Happy coding!**
