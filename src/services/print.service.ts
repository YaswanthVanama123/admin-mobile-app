import axios, { AxiosInstance } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../utils/constants';

/**
 * Print Service Client for Admin Mobile App
 * Communicates with the Print Service (standalone Electron app) for thermal printing
 */

interface PrintServiceConfig {
  baseURL: string;
  timeout: number;
}

interface Order {
  _id: string;
  orderNumber: string;
  tableNumber?: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
    customizations?: string[];
  }>;
  subtotal: number;
  tax: number;
  total: number;
  status: string;
  createdAt: string | Date;
}

class PrintService {
  private client: AxiosInstance;
  private defaultConfig: PrintServiceConfig = {
    baseURL: 'http://localhost:9100',
    timeout: 10000,
  };

  constructor() {
    this.client = this.createClient(this.defaultConfig);
    this.loadSavedURL();
  }

  private createClient(config: PrintServiceConfig): AxiosInstance {
    return axios.create({
      baseURL: config.baseURL,
      timeout: config.timeout,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  /**
   * Update Print Service URL (for network printing from tablets)
   * Example: http://192.168.1.100:9100
   */
  async updateBaseURL(url: string): Promise<void> {
    try {
      this.defaultConfig.baseURL = url;
      this.client = this.createClient(this.defaultConfig);
      await AsyncStorage.setItem(STORAGE_KEYS.PRINT_SERVICE_URL, url);
      console.log('✅ Print Service URL updated:', url);
    } catch (error) {
      console.error('Failed to update Print Service URL:', error);
      throw error;
    }
  }

  /**
   * Load saved Print Service URL from storage
   */
  async loadSavedURL(): Promise<void> {
    try {
      const savedURL = await AsyncStorage.getItem(STORAGE_KEYS.PRINT_SERVICE_URL);
      if (savedURL) {
        this.defaultConfig.baseURL = savedURL;
        this.client = this.createClient(this.defaultConfig);
        console.log('✅ Loaded saved Print Service URL:', savedURL);
      }
    } catch (error) {
      console.error('Failed to load saved Print Service URL:', error);
    }
  }

  /**
   * Check if Print Service is available
   * Returns true if service is running, false otherwise
   */
  async healthCheck(): Promise<boolean> {
    try {
      const response = await this.client.get('/health', { timeout: 3000 });
      return response.data.status === 'running';
    } catch (error) {
      console.error('Print Service health check failed:', error);
      return false;
    }
  }

  /**
   * Print order to thermal printer via Print Service
   */
  async printOrder(order: Order): Promise<void> {
    try {
      console.log('🖨️  Sending order to Print Service:', order.orderNumber);

      const response = await this.client.post('/print', order);

      if (response.data.success) {
        console.log('✅ Order printed successfully:', order.orderNumber);
      } else {
        throw new Error(response.data.error || 'Print failed');
      }
    } catch (error: any) {
      console.error('❌ Failed to print order:', error);

      if (error.code === 'ECONNREFUSED' || error.code === 'ECONNABORTED') {
        throw new Error(
          'Print Service not available. Please check:\n' +
            '1. Print Service app is running\n' +
            '2. Print Service URL is correct in settings\n' +
            '3. You are on the same network (for tablets)'
        );
      }

      throw error;
    }
  }

  /**
   * Test print connection
   * Sends a test print to verify printer is working
   */
  async testPrint(): Promise<{ success: boolean; message?: string; error?: string }> {
    try {
      console.log('🖨️  Sending test print...');

      const response = await this.client.post('/test-print');

      console.log('Test print response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Test print failed:', error);

      if (error.code === 'ECONNREFUSED' || error.code === 'ECONNABORTED') {
        return {
          success: false,
          error: 'Cannot reach Print Service. Check if it\'s running and URL is correct.',
        };
      }

      return {
        success: false,
        error: error.message || 'Test print failed',
      };
    }
  }

  /**
   * Get current Print Service URL
   */
  getBaseURL(): string {
    return this.defaultConfig.baseURL;
  }

  /**
   * Get Print Service settings from server
   */
  async getSettings(): Promise<any> {
    try {
      const response = await this.client.get('/settings');
      return response.data;
    } catch (error) {
      console.error('Failed to get Print Service settings:', error);
      throw error;
    }
  }
}

export const printService = new PrintService();
export default printService;
