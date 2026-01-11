/**
 * Platform-agnostic environment configuration
 * Works with both React (Vite/CRA) and React Native (expo-constants)
 */

export interface EnvironmentConfig {
  apiUrl: string;
  socketUrl?: string;
  environment: 'development' | 'staging' | 'production';
  debug?: boolean;
}

class ConfigManager {
  private config: EnvironmentConfig | null = null;

  /**
   * Set configuration manually
   * Use this for React Native or when you want to set config programmatically
   */
  setConfig(config: EnvironmentConfig) {
    this.config = config;
  }

  /**
   * Get configuration
   * Auto-detects environment variables for web (Vite/CRA)
   * Falls back to manual config if set
   */
  getConfig(): EnvironmentConfig {
    if (this.config) {
      return this.config;
    }

    // Auto-detect for web environments
    if (typeof window !== 'undefined') {
      // Vite (import.meta.env)
      if (typeof import.meta !== 'undefined' && import.meta.env) {
        return this.getViteConfig();
      }

      // Create React App (process.env.REACT_APP_*)
      if (typeof process !== 'undefined' && process.env) {
        return this.getCRAConfig();
      }
    }

    // Default fallback
    return {
      apiUrl: 'http://localhost:5000',
      socketUrl: 'http://localhost:5000',
      environment: 'development',
      debug: true,
    };
  }

  /**
   * Get Vite configuration (import.meta.env)
   */
  private getViteConfig(): EnvironmentConfig {
    return {
      apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:5000',
      socketUrl: import.meta.env.VITE_SOCKET_URL || import.meta.env.VITE_API_URL || 'http://localhost:5000',
      environment: (import.meta.env.VITE_ENVIRONMENT as any) || 'development',
      debug: import.meta.env.VITE_DEBUG === 'true' || import.meta.env.MODE === 'development',
    };
  }

  /**
   * Get Create React App configuration (process.env.REACT_APP_*)
   */
  private getCRAConfig(): EnvironmentConfig {
    return {
      apiUrl: process.env.REACT_APP_API_URL || 'http://localhost:5000',
      socketUrl: process.env.REACT_APP_SOCKET_URL || process.env.REACT_APP_API_URL || 'http://localhost:5000',
      environment: (process.env.REACT_APP_ENVIRONMENT as any) || 'development',
      debug: process.env.REACT_APP_DEBUG === 'true' || process.env.NODE_ENV === 'development',
    };
  }

  /**
   * Get API URL
   */
  getApiUrl(): string {
    return this.getConfig().apiUrl;
  }

  /**
   * Get Socket URL
   */
  getSocketUrl(): string {
    return this.getConfig().socketUrl || this.getConfig().apiUrl;
  }

  /**
   * Get environment
   */
  getEnvironment(): 'development' | 'staging' | 'production' {
    return this.getConfig().environment;
  }

  /**
   * Check if debug mode is enabled
   */
  isDebug(): boolean {
    return this.getConfig().debug || false;
  }

  /**
   * Check if in production
   */
  isProduction(): boolean {
    return this.getConfig().environment === 'production';
  }

  /**
   * Check if in development
   */
  isDevelopment(): boolean {
    return this.getConfig().environment === 'development';
  }

  /**
   * Check if in staging
   */
  isStaging(): boolean {
    return this.getConfig().environment === 'staging';
  }
}

export const config = new ConfigManager();

// Example usage:
//
// For React (web):
// - Vite: Set VITE_API_URL in .env
// - CRA: Set REACT_APP_API_URL in .env
// - The config will auto-detect and use these values
//
// For React Native:
// ```typescript
// import { config } from '@/api/config';
// import Constants from 'expo-constants';
//
// config.setConfig({
//   apiUrl: Constants.expoConfig?.extra?.apiUrl || 'http://localhost:5000',
//   environment: Constants.expoConfig?.extra?.environment || 'development',
//   debug: __DEV__,
// });
// ```
