import apiClient from './apiClient';
import { API_ENDPOINTS } from './config';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
}

export const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await apiClient.post(API_ENDPOINTS.LOGIN, credentials);
    return response.data;
  },

  logout: async (): Promise<void> => {
    await apiClient.post(API_ENDPOINTS.LOGOUT);
  },

  refreshToken: async (): Promise<AuthResponse> => {
    const response = await apiClient.post(API_ENDPOINTS.REFRESH);
    return response.data;
  },
};
