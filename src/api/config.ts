// API client configuration
export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api';

export const API_ENDPOINTS = {
  // Auth endpoints
  LOGIN: '/auth/login',
  LOGOUT: '/auth/logout',
  REFRESH: '/auth/refresh',

  // Order endpoints
  ORDERS: '/orders',
  ORDER_BY_ID: (id: string) => `/orders/${id}`,

  // Product endpoints
  PRODUCTS: '/products',
  PRODUCT_BY_ID: (id: string) => `/products/${id}`,

  // Dashboard endpoints
  DASHBOARD_STATS: '/dashboard/stats',
};
