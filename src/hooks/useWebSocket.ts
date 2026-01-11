import { useEffect, useRef, useCallback, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { Order, OrderUpdateEvent } from '../types';

const SOCKET_URL = process.env.EXPO_PUBLIC_SOCKET_URL || 'http://localhost:5000';

interface UseWebSocketOptions {
  onOrderCreated?: (order: Order) => void;
  onOrderUpdated?: (order: Order) => void;
  onOrderCancelled?: (order: Order) => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onError?: (error: Error) => void;
}

export const useWebSocket = (options: UseWebSocketOptions = {}) => {
  const {
    onOrderCreated,
    onOrderUpdated,
    onOrderCancelled,
    onConnect,
    onDisconnect,
    onError,
  } = options;

  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Initialize socket connection
    socketRef.current = io(SOCKET_URL, {
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    const socket = socketRef.current;

    // Connection event handlers
    socket.on('connect', () => {
      console.log('WebSocket connected');
      setIsConnected(true);
      onConnect?.();
    });

    socket.on('disconnect', () => {
      console.log('WebSocket disconnected');
      setIsConnected(false);
      onDisconnect?.();
    });

    socket.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error);
      onError?.(error);
    });

    // Order event handlers
    socket.on('order:created', (data: OrderUpdateEvent) => {
      console.log('New order created:', data.order);
      onOrderCreated?.(data.order);
    });

    socket.on('order:updated', (data: OrderUpdateEvent) => {
      console.log('Order updated:', data.order);
      onOrderUpdated?.(data.order);
    });

    socket.on('order:cancelled', (data: OrderUpdateEvent) => {
      console.log('Order cancelled:', data.order);
      onOrderCancelled?.(data.order);
    });

    // Cleanup on unmount
    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [onOrderCreated, onOrderUpdated, onOrderCancelled, onConnect, onDisconnect, onError]);

  // Join kitchen room to receive kitchen-specific events
  const joinKitchenRoom = useCallback((restaurantId: string) => {
    if (socketRef.current) {
      socketRef.current.emit('join:kitchen', { restaurantId });
      console.log('Joined kitchen room for restaurant:', restaurantId);
    }
  }, []);

  // Leave kitchen room
  const leaveKitchenRoom = useCallback((restaurantId: string) => {
    if (socketRef.current) {
      socketRef.current.emit('leave:kitchen', { restaurantId });
      console.log('Left kitchen room for restaurant:', restaurantId);
    }
  }, []);

  return {
    isConnected,
    joinKitchenRoom,
    leaveKitchenRoom,
    socket: socketRef.current,
  };
};
