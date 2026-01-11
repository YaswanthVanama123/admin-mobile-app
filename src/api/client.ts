import axios from 'axios';
import { SecureStorage } from '../utils/storage';
import { API_BASE_URL, STORAGE_KEYS } from '../utils/constants';

// Create axios instance
export const apiClient = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Request interceptor - Add auth token and restaurant ID
apiClient.interceptors.request.use(
  async (config) => {
    try {
      // Add auth token
      const token = await SecureStorage.getItem(STORAGE_KEYS.ADMIN_TOKEN);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      // Add restaurant ID header for multi-tenant isolation
      const restaurantId = await SecureStorage.getItem(STORAGE_KEYS.RESTAURANT_ID);
      if (restaurantId) {
        config.headers['x-restaurant-id'] = restaurantId;
      }
    } catch (error) {
      console.error('Error adding request headers:', error);
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors globally
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    // Handle 401 Unauthorized and 403 Forbidden
    if (error.response?.status === 401 || error.response?.status === 403) {
      // Only clear auth if it's an actual token expiry/invalid error
      const errorMessage = error.response?.data?.message || '';
      if (errorMessage.includes('token') || errorMessage.includes('expired') || errorMessage.includes('invalid')) {
        console.log('[API Client] Token expired or invalid - clearing session');

        // Clear auth data
        await SecureStorage.removeItem(STORAGE_KEYS.ADMIN_TOKEN);
        await SecureStorage.removeItem(STORAGE_KEYS.ADMIN_DATA);
        await SecureStorage.removeItem(STORAGE_KEYS.RESTAURANT_ID);

        // Navigation should be handled by auth context
      } else {
        console.warn('[API Client] Received 401/403 but not clearing auth - might be temporary server issue');
      }
    } else if (!error.response) {
      // Network error - backend is down or unreachable
      console.warn('[API Client] Network error - backend may be restarting or unreachable');
      // Don't clear auth data - keep user logged in
    }

    // Log error for debugging
    console.error('API Error:', error.response?.data || error.message);

    return Promise.reject(error);
  }
);

export default apiClient;
