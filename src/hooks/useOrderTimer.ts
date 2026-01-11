import { useState, useEffect, useRef } from 'react';
import { getPreparationTime } from '../utils';

interface UseOrderTimerOptions {
  orderId: string;
  createdAt: string;
  preparationStartedAt?: string;
  onUrgent?: (orderId: string, minutes: number) => void;
  onCritical?: (orderId: string, minutes: number) => void;
}

export const useOrderTimer = ({
  orderId,
  createdAt,
  preparationStartedAt,
  onUrgent,
  onCritical,
}: UseOrderTimerOptions) => {
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [elapsedMinutes, setElapsedMinutes] = useState(0);
  const urgentNotifiedRef = useRef(false);
  const criticalNotifiedRef = useRef(false);

  useEffect(() => {
    // Calculate initial elapsed time
    const startTime = preparationStartedAt
      ? new Date(preparationStartedAt).getTime()
      : new Date(createdAt).getTime();
    const initialElapsed = Math.floor((Date.now() - startTime) / 1000);
    setElapsedSeconds(initialElapsed);
    setElapsedMinutes(Math.floor(initialElapsed / 60));

    // Update timer every second
    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      setElapsedSeconds(elapsed);

      const minutes = Math.floor(elapsed / 60);
      setElapsedMinutes(minutes);

      // Check for urgent threshold (15 minutes)
      if (minutes >= 15 && !urgentNotifiedRef.current) {
        urgentNotifiedRef.current = true;
        onUrgent?.(orderId, minutes);
      }

      // Check for critical threshold (30 minutes)
      if (minutes >= 30 && !criticalNotifiedRef.current) {
        criticalNotifiedRef.current = true;
        onCritical?.(orderId, minutes);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [orderId, createdAt, preparationStartedAt, onUrgent, onCritical]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const isUrgent = elapsedMinutes >= 15;
  const isCritical = elapsedMinutes >= 30;

  return {
    elapsedSeconds,
    elapsedMinutes,
    formattedTime: formatTime(elapsedSeconds),
    isUrgent,
    isCritical,
  };
};

/**
 * Hook for managing multiple order timers
 */
export const useMultipleOrderTimers = (orderIds: string[]) => {
  const [timers, setTimers] = useState<Record<string, number>>({});

  useEffect(() => {
    const intervals: Record<string, NodeJS.Timeout> = {};

    orderIds.forEach((orderId) => {
      intervals[orderId] = setInterval(() => {
        setTimers((prev) => ({
          ...prev,
          [orderId]: (prev[orderId] || 0) + 1,
        }));
      }, 1000);
    });

    return () => {
      Object.values(intervals).forEach((interval) => clearInterval(interval));
    };
  }, [orderIds]);

  return timers;
};
