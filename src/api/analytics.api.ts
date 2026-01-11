import { apiClient } from './client';
import {
  RevenueData,
  PopularItem,
  PeakHour,
  CategoryPerformance,
  AnalyticsDateRange,
  ApiResponse,
  AnalyticsPageData,
} from './types';

export const analyticsApi = {
  /**
   * Get all analytics page data (combined endpoint) - OPTIMIZED
   */
  getPageData: async (dateRange: AnalyticsDateRange): Promise<AnalyticsPageData> => {
    const response = await apiClient.get<ApiResponse<AnalyticsPageData>>('/analytics/page-data', {
      params: dateRange,
    });
    return response.data.data;
  },

  /**
   * Get revenue analytics
   */
  getRevenue: async (dateRange: AnalyticsDateRange): Promise<RevenueData[]> => {
    const response = await apiClient.get<ApiResponse<RevenueData[]>>('/analytics/revenue', {
      params: dateRange,
    });
    return response.data.data;
  },

  /**
   * Get popular items
   */
  getPopularItems: async (dateRange: AnalyticsDateRange): Promise<PopularItem[]> => {
    const response = await apiClient.get<ApiResponse<PopularItem[]>>('/analytics/popular-items', {
      params: dateRange,
    });
    return response.data.data;
  },

  /**
   * Get peak hours
   */
  getPeakHours: async (dateRange: AnalyticsDateRange): Promise<PeakHour[]> => {
    const response = await apiClient.get<ApiResponse<PeakHour[]>>('/analytics/peak-hours', {
      params: dateRange,
    });
    return response.data.data;
  },

  /**
   * Get category performance
   */
  getCategoryPerformance: async (dateRange: AnalyticsDateRange): Promise<CategoryPerformance[]> => {
    const response = await apiClient.get<ApiResponse<CategoryPerformance[]>>(
      '/analytics/category-performance',
      {
        params: dateRange,
      }
    );
    return response.data.data;
  },

  /**
   * Get table performance metrics
   */
  getTablePerformance: async (dateRange: AnalyticsDateRange): Promise<any> => {
    const response = await apiClient.get<ApiResponse<any>>('/analytics/table-performance', {
      params: dateRange,
    });
    return response.data.data;
  },

  /**
   * Get preparation time analytics
   */
  getPreparationTime: async (dateRange: AnalyticsDateRange): Promise<any> => {
    const response = await apiClient.get<ApiResponse<any>>('/analytics/preparation-time', {
      params: dateRange,
    });
    return response.data.data;
  },

  /**
   * Get dashboard analytics (aggregated)
   */
  getDashboardAnalytics: async (): Promise<any> => {
    const response = await apiClient.get<ApiResponse<any>>('/analytics/dashboard');
    return response.data.data;
  },

  /**
   * Get revenue by time period (daily, weekly, monthly)
   */
  getRevenueByPeriod: async (
    period: 'daily' | 'weekly' | 'monthly',
    dateRange: AnalyticsDateRange
  ): Promise<RevenueData[]> => {
    const response = await apiClient.get<ApiResponse<RevenueData[]>>(
      `/analytics/revenue/${period}`,
      {
        params: dateRange,
      }
    );
    return response.data.data;
  },

  /**
   * Get order trends
   */
  getOrderTrends: async (dateRange: AnalyticsDateRange): Promise<any> => {
    const response = await apiClient.get<ApiResponse<any>>('/analytics/order-trends', {
      params: dateRange,
    });
    return response.data.data;
  },

  /**
   * Get customer satisfaction metrics
   */
  getCustomerSatisfaction: async (dateRange: AnalyticsDateRange): Promise<any> => {
    const response = await apiClient.get<ApiResponse<any>>('/analytics/customer-satisfaction', {
      params: dateRange,
    });
    return response.data.data;
  },

  /**
   * Get staff performance
   */
  getStaffPerformance: async (dateRange: AnalyticsDateRange): Promise<any> => {
    const response = await apiClient.get<ApiResponse<any>>('/analytics/staff-performance', {
      params: dateRange,
    });
    return response.data.data;
  },

  /**
   * Get inventory insights
   */
  getInventoryInsights: async (dateRange: AnalyticsDateRange): Promise<any> => {
    const response = await apiClient.get<ApiResponse<any>>('/analytics/inventory-insights', {
      params: dateRange,
    });
    return response.data.data;
  },

  /**
   * Export analytics data
   */
  exportData: async (
    type: 'revenue' | 'orders' | 'items' | 'all',
    dateRange: AnalyticsDateRange,
    format: 'csv' | 'excel' | 'pdf' = 'csv'
  ): Promise<Blob> => {
    const response = await apiClient.get(`/analytics/export/${type}`, {
      params: { ...dateRange, format },
      responseType: 'blob',
    });
    return response.data;
  },

  /**
   * Get real-time analytics (live)
   */
  getRealTimeAnalytics: async (): Promise<any> => {
    const response = await apiClient.get<ApiResponse<any>>('/analytics/real-time');
    return response.data.data;
  },
};
