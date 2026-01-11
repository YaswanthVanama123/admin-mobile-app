/**
 * React (Web) Example Usage
 * This file demonstrates how to use the unified API client in a React web application
 */

// main.tsx or App.tsx
import React, { useEffect, useState } from 'react';
import { initializeApi, authApi, storage, menuApi, ordersApi } from '@patlinks/admin-shared-components/api';
import type { Admin, MenuItem, Order } from '@patlinks/admin-shared-components/api';

// Initialize API client once at app startup
initializeApi({
  onUnauthorized: () => {
    // Redirect to login when unauthorized
    window.location.href = '/login';
  },
  onNetworkError: (error) => {
    console.error('Network error:', error);
    // Show error toast/notification
  },
  debug: import.meta.env.MODE === 'development',
});

// Example: Login Component
export function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { token, admin } = await authApi.login({ username, password });

      // Save auth data
      await storage.setToken(token);
      await storage.setRestaurantId(admin.restaurantId);
      await storage.setAdminData(admin);

      // Redirect to dashboard
      window.location.href = '/dashboard';
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />
      {error && <div className="error">{error}</div>}
      <button type="submit" disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
}

// Example: Menu Items Component
export function MenuItemsPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadMenuItems();
  }, []);

  const loadMenuItems = async () => {
    try {
      setLoading(true);
      const items = await menuApi.getAll();
      setMenuItems(items);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load menu items');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleAvailability = async (id: string) => {
    try {
      const updatedItem = await menuApi.toggleAvailability(id);
      setMenuItems((items) =>
        items.map((item) => (item._id === id ? updatedItem : item))
      );
    } catch (err: any) {
      console.error('Failed to toggle availability:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;

    try {
      await menuApi.delete(id);
      setMenuItems((items) => items.filter((item) => item._id !== id));
    } catch (err: any) {
      console.error('Failed to delete item:', err);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Menu Items</h1>
      <div className="menu-items-grid">
        {menuItems.map((item) => (
          <div key={item._id} className="menu-item-card">
            <h3>{item.name}</h3>
            <p>{item.description}</p>
            <p>Price: ${item.price}</p>
            <p>Available: {item.isAvailable ? 'Yes' : 'No'}</p>
            <button onClick={() => handleToggleAvailability(item._id)}>
              Toggle Availability
            </button>
            <button onClick={() => handleDelete(item._id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}

// Example: Orders Component
export function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();

    // Poll for new orders every 5 seconds
    const interval = setInterval(loadOrders, 5000);
    return () => clearInterval(interval);
  }, []);

  const loadOrders = async () => {
    try {
      const activeOrders = await ordersApi.getActive();
      setOrders(activeOrders);
    } catch (err) {
      console.error('Failed to load orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (orderId: string, status: any) => {
    try {
      const updatedOrder = await ordersApi.updateStatus(orderId, status);
      setOrders((orders) =>
        orders.map((order) => (order._id === orderId ? updatedOrder : order))
      );
    } catch (err) {
      console.error('Failed to update order status:', err);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1>Active Orders</h1>
      <div className="orders-list">
        {orders.map((order) => (
          <div key={order._id} className="order-card">
            <h3>Order #{order.orderNumber}</h3>
            <p>Table: {order.tableNumber}</p>
            <p>Status: {order.status}</p>
            <p>Total: ${order.total.toFixed(2)}</p>
            <div className="order-items">
              {order.items.map((item, index) => (
                <div key={index}>
                  {item.quantity}x {item.name}
                </div>
              ))}
            </div>
            <div className="order-actions">
              <button onClick={() => handleUpdateStatus(order._id, 'preparing')}>
                Start Preparing
              </button>
              <button onClick={() => handleUpdateStatus(order._id, 'ready')}>
                Mark Ready
              </button>
              <button onClick={() => handleUpdateStatus(order._id, 'served')}>
                Mark Served
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Example: Protected Route Component
export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [admin, setAdmin] = useState<Admin | null>(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = await storage.getToken();
      if (!token) {
        setAuthenticated(false);
        return;
      }

      const currentAdmin = await authApi.getCurrentAdmin();
      setAdmin(currentAdmin);
      setAuthenticated(true);
    } catch (err) {
      setAuthenticated(false);
      await storage.clearAuth();
    }
  };

  if (authenticated === null) {
    return <div>Loading...</div>;
  }

  if (!authenticated) {
    window.location.href = '/login';
    return null;
  }

  return <>{children}</>;
}

// Example: File Upload
export async function uploadMenuItemImage(file: File): Promise<string> {
  const { uploadApi } = await import('@patlinks/admin-shared-components/api');

  try {
    const result = await uploadApi.uploadImage(file, {
      folder: 'menu-items',
      resize: true,
      width: 800,
      height: 600,
    });
    return result.url;
  } catch (error) {
    console.error('Failed to upload image:', error);
    throw error;
  }
}
