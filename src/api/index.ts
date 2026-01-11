/**
 * Unified API Client for Admin Applications
 * Works across React (web) and React Native (mobile)
 *
 * @packageDocumentation
 */

// Core exports
export { apiClient } from './client';
export { storage, STORAGE_KEYS } from './storage';
export { config } from './config';

// API modules
export { authApi } from './auth.api';
export { menuApi } from './menu.api';
export { categoriesApi } from './categories.api';
export { tablesApi } from './tables.api';
export { ordersApi } from './orders.api';
export { analyticsApi } from './analytics.api';
export { dashboardApi } from './dashboard.api';
export { kitchenApi } from './kitchen.api';
export { addOnsApi } from './addons.api';
export { settingsApi } from './settings.api';
export { uploadApi } from './upload.api';

// Types
export type {
  // Core types
  Admin,
  Restaurant,
  MenuItem,
  Category,
  Table,
  Order,
  OrderItem,
  OrderStatus,
  AddOn,

  // Response types
  ApiResponse,
  PaginatedResponse,

  // Form types
  LoginFormData,
  MenuItemFormData,
  CategoryFormData,
  TableFormData,
  AddOnFormData,

  // Filter types
  OrderFilters,
  MenuFilters,
  AnalyticsDateRange,

  // Dashboard types
  DashboardStats,

  // Analytics types
  RevenueData,
  PopularItem,
  PeakHour,
  CategoryPerformance,
  AnalyticsPageData,

  // Menu types
  MenuPageData,
  Customization,
  CustomizationOption,

  // Order types
  StatusHistory,
} from './types';

// Export additional types from specific modules
export type { DashboardPageData } from './dashboard.api';
export type { KitchenOrders } from './kitchen.api';
export type { CreateOrderData } from './orders.api';
export type { UpdateSettingsData } from './settings.api';
export type { UploadResponse } from './upload.api';

// Export types from storage and config
export type { StorageAdapter } from './storage';
export type { EnvironmentConfig } from './config';
export type { ApiClientConfig } from './client';

/**
 * Initialize the unified API client
 *
 * @example
 * // For React (web) - auto-detects from .env
 * import { initializeApi } from '@patlinks/admin-shared-components/api';
 *
 * initializeApi({
 *   onUnauthorized: () => {
 *     window.location.href = '/login';
 *   },
 *   onNetworkError: (error) => {
 *     console.error('Network error:', error);
 *   },
 *   debug: true,
 * });
 *
 * @example
 * // For React Native - manual configuration
 * import { initializeApi, storage } from '@patlinks/admin-shared-components/api';
 * import AsyncStorage from '@react-native-async-storage/async-storage';
 * import Constants from 'expo-constants';
 *
 * // Set storage adapter
 * storage.setAdapter(AsyncStorage);
 *
 * // Initialize API
 * initializeApi({
 *   apiUrl: Constants.expoConfig?.extra?.apiUrl,
 *   environment: Constants.expoConfig?.extra?.environment,
 *   onUnauthorized: () => {
 *     // Navigate to login screen
 *   },
 *   debug: __DEV__,
 * });
 */
export function initializeApi(options?: {
  apiUrl?: string;
  environment?: 'development' | 'staging' | 'production';
  onUnauthorized?: () => void;
  onNetworkError?: (error: Error) => void;
  debug?: boolean;
}) {
  // Set config if provided
  if (options?.apiUrl || options?.environment) {
    config.setConfig({
      apiUrl: options.apiUrl || config.getApiUrl(),
      environment: options.environment || config.getEnvironment(),
      debug: options.debug !== undefined ? options.debug : config.isDebug(),
    });
  }

  // Initialize API client
  apiClient.initialize({
    baseURL: config.getApiUrl(),
    timeout: 30000,
    onUnauthorized: options?.onUnauthorized,
    onNetworkError: options?.onNetworkError,
    debug: options?.debug !== undefined ? options.debug : config.isDebug(),
  });
}
