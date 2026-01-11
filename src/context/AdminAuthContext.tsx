import React, { createContext, useContext, useEffect, useState } from 'react';
import { Admin, LoginFormData, AuthContextType } from '../types';
import { authApi } from '../api/auth.api';
import { SecureStorage } from '../utils/storage';
import { STORAGE_KEYS } from '../utils/constants';

const AdminAuthContext = createContext<AuthContextType | undefined>(undefined);

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  /**
   * Login admin
   */
  const login = async (username: string, password: string): Promise<void> => {
    try {
      setIsLoading(true);

      const credentials: LoginFormData = { username, password };
      const { token, admin: adminData } = await authApi.login(credentials);

      console.log('[Auth Context] Login response - admin data:', adminData);
      console.log('[Auth Context] Admin restaurantId from response:', adminData.restaurantId);

      // Store token and admin data
      await SecureStorage.setItem(STORAGE_KEYS.ADMIN_TOKEN, token);
      await SecureStorage.setObject(STORAGE_KEYS.ADMIN_DATA, adminData);

      // Store restaurant ID
      if (adminData.restaurantId) {
        await SecureStorage.setItem(STORAGE_KEYS.RESTAURANT_ID, adminData.restaurantId);
        console.log('[Auth Context] Storing restaurant ID:', adminData.restaurantId);
      } else {
        console.error('[Auth Context] No restaurant ID available!');
      }

      // Update state
      setAdmin(adminData);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Logout admin
   */
  const logout = async (): Promise<void> => {
    try {
      await authApi.logout();
    } catch (error) {
      console.error('Logout API call failed:', error);
    } finally {
      // Clear secure storage
      await SecureStorage.removeItem(STORAGE_KEYS.ADMIN_TOKEN);
      await SecureStorage.removeItem(STORAGE_KEYS.ADMIN_DATA);
      await SecureStorage.removeItem(STORAGE_KEYS.RESTAURANT_ID);

      // Update state
      setAdmin(null);
      setIsAuthenticated(false);
    }
  };

  /**
   * Refresh admin data from server
   */
  const refreshAdmin = async (): Promise<void> => {
    try {
      setIsLoading(true);
      const adminData = await authApi.getCurrentAdmin();

      // Update stored admin data
      await SecureStorage.setObject(STORAGE_KEYS.ADMIN_DATA, adminData);
      await SecureStorage.setItem(STORAGE_KEYS.RESTAURANT_ID, adminData.restaurantId);

      // Update state
      setAdmin(adminData);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Failed to refresh admin data:', error);

      // Clear authentication on failure
      await SecureStorage.removeItem(STORAGE_KEYS.ADMIN_TOKEN);
      await SecureStorage.removeItem(STORAGE_KEYS.ADMIN_DATA);
      await SecureStorage.removeItem(STORAGE_KEYS.RESTAURANT_ID);

      setAdmin(null);
      setIsAuthenticated(false);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Check authentication status on mount
   * Optimistic check - just verify token and cached data exist
   */
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await SecureStorage.getItem(STORAGE_KEYS.ADMIN_TOKEN);
        const cachedAdmin = await SecureStorage.getObject<Admin>(STORAGE_KEYS.ADMIN_DATA);
        const restaurantId = await SecureStorage.getItem(STORAGE_KEYS.RESTAURANT_ID);

        console.log('[Auth Context] Initial auth check:', {
          hasToken: !!token,
          hasAdmin: !!cachedAdmin,
          restaurantId
        });

        if (token && cachedAdmin && restaurantId) {
          // Use cached admin data to avoid unnecessary API call on every app launch
          setAdmin(cachedAdmin);
          setIsAuthenticated(true);
          console.log('[Auth Context] Restored session from secure storage');
        }
      } catch (error) {
        console.error('Failed to restore session:', error);
        // Clear invalid cache
        await SecureStorage.removeItem(STORAGE_KEYS.ADMIN_TOKEN);
        await SecureStorage.removeItem(STORAGE_KEYS.ADMIN_DATA);
        await SecureStorage.removeItem(STORAGE_KEYS.RESTAURANT_ID);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const value: AuthContextType = {
    admin,
    isAuthenticated,
    isLoading,
    login,
    logout,
    refreshAdmin,
  };

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AdminAuthProvider');
  }
  return context;
};
