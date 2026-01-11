import apiClient from './client';
import { Order, ApiResponse, KitchenOrders } from '../types';

export const kitchenApi = {
  /**
   * Get orders for kitchen display (grouped by status)
   */
  getOrders: async (): Promise<KitchenOrders> => {
    const response = await apiClient.get<ApiResponse<KitchenOrders>>('/kitchen/orders');
    return response.data.data;
  },

  /**
   * Start preparing an order
   */
  startPreparing: async (orderId: string): Promise<Order> => {
    const response = await apiClient.patch<ApiResponse<Order>>(
      `/kitchen/orders/${orderId}/start`
    );
    return response.data.data;
  },

  /**
   * Mark order as ready
   */
  markReady: async (orderId: string): Promise<Order> => {
    const response = await apiClient.patch<ApiResponse<Order>>(
      `/kitchen/orders/${orderId}/ready`
    );
    return response.data.data;
  },

  /**
   * Mark order as served
   */
  markServed: async (orderId: string): Promise<Order> => {
    const response = await apiClient.patch<ApiResponse<Order>>(
      `/kitchen/orders/${orderId}/served`
    );
    return response.data.data;
  },

  /**
   * Update item status within an order
   */
  updateItemStatus: async (
    orderId: string,
    itemIndex: number,
    status: 'pending' | 'preparing' | 'completed'
  ): Promise<Order> => {
    const response = await apiClient.patch<ApiResponse<Order>>(
      `/kitchen/orders/${orderId}/items/${itemIndex}/status`,
      { status }
    );
    return response.data.data;
  },

  /**
   * Get kitchen statistics
   */
  getStats: async (): Promise<any> => {
    const response = await apiClient.get<ApiResponse<any>>('/kitchen/stats');
    return response.data.data;
  },
};
