import { apiClient } from './client';
import { Restaurant, ApiResponse } from './types';

export interface UpdateSettingsData {
  name?: string;
  email?: string;
  phone?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  branding?: {
    logo?: string;
    primaryColor?: string;
    secondaryColor?: string;
    accentColor?: string;
    fontFamily?: string;
    theme?: 'light' | 'dark';
    customCSS?: string;
  };
  settings?: {
    currency?: string;
    taxRate?: number;
    serviceChargeRate?: number;
    timezone?: string;
    locale?: string;
    orderNumberPrefix?: string;
  };
}

export const settingsApi = {
  /**
   * Get restaurant settings
   */
  getRestaurant: async (): Promise<Restaurant> => {
    const response = await apiClient.get<ApiResponse<Restaurant>>('/settings/restaurant');
    return response.data.data;
  },

  /**
   * Update restaurant settings
   */
  updateRestaurant: async (data: UpdateSettingsData): Promise<Restaurant> => {
    const response = await apiClient.put<ApiResponse<Restaurant>>('/settings/restaurant', data);
    return response.data.data;
  },

  /**
   * Upload restaurant logo
   */
  uploadLogo: async (file: File | any): Promise<{ logoUrl: string }> => {
    const formData = new FormData();
    formData.append('logo', file);

    const response = await apiClient.post<ApiResponse<{ logoUrl: string }>>(
      '/settings/restaurant/logo',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data.data;
  },

  /**
   * Get notification settings
   */
  getNotificationSettings: async (): Promise<any> => {
    const response = await apiClient.get<ApiResponse<any>>('/settings/notifications');
    return response.data.data;
  },

  /**
   * Update notification settings
   */
  updateNotificationSettings: async (data: any): Promise<any> => {
    const response = await apiClient.put<ApiResponse<any>>('/settings/notifications', data);
    return response.data.data;
  },

  /**
   * Get payment settings
   */
  getPaymentSettings: async (): Promise<any> => {
    const response = await apiClient.get<ApiResponse<any>>('/settings/payment');
    return response.data.data;
  },

  /**
   * Update payment settings
   */
  updatePaymentSettings: async (data: any): Promise<any> => {
    const response = await apiClient.put<ApiResponse<any>>('/settings/payment', data);
    return response.data.data;
  },

  /**
   * Get subscription info
   */
  getSubscription: async (): Promise<any> => {
    const response = await apiClient.get<ApiResponse<any>>('/settings/subscription');
    return response.data.data;
  },

  /**
   * Update subscription
   */
  updateSubscription: async (plan: string): Promise<any> => {
    const response = await apiClient.post<ApiResponse<any>>('/settings/subscription', { plan });
    return response.data.data;
  },

  /**
   * Get printer settings
   */
  getPrinterSettings: async (): Promise<any> => {
    const response = await apiClient.get<ApiResponse<any>>('/settings/printer');
    return response.data.data;
  },

  /**
   * Update printer settings
   */
  updatePrinterSettings: async (data: any): Promise<any> => {
    const response = await apiClient.put<ApiResponse<any>>('/settings/printer', data);
    return response.data.data;
  },
};
