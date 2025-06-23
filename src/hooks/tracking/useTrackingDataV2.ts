
import { useState, useEffect, useCallback, useRef } from "react";
import { UseTrackingDataReturn } from "./types";
import { loadTrackingData } from "./utils/dataLoaderUtils";
import { startExtendedSession } from "./utils/sessionUtils";
import { useTrackingEventListeners } from "./useTrackingEventListeners";
import { useTrackingNavigation } from "./useTrackingNavigation";

export const useTrackingDataV2 = (bookingId: string): UseTrackingDataReturn => {
  const [booking, setBooking] = useState<any>(null);
  const [tasks, setTasks] = useState<any[]>([]);
  const [isInspected, setIsInspected] = useState(false);
  const [progress, setProgress] = useState(0);
  const [sessionExpired, setSessionExpired] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const lastLoadTime = useRef<number>(0);

  // Enhanced data loader with throttling
  const loadAllData = useCallback(() => {
    // Prevent excessive loading calls
    const now = Date.now();
    if (now - lastLoadTime.current < 500) {
      console.log('Throttling load call - too recent');
      return;
    }
    lastLoadTime.current = now;
    
    setError(null);
    
    const result = loadTrackingData(bookingId);
    
    setBooking(result.booking);
    setTasks(result.tasks);
    setIsInspected(result.isInspected);
    setProgress(result.progress);
    setError(result.error);
    
    // Extended session management
    if (result.booking?.status === "finished") {
      startExtendedSession(() => setSessionExpired(true));
    }
    
    setIsLoading(false);
  }, [bookingId]);

  // Initial load effect
  useEffect(() => {
    if (bookingId) {
      loadAllData();
    }
  }, [bookingId, loadAllData]);

  // Use event listeners hook
  useTrackingEventListeners(bookingId, loadAllData);

  // Use navigation hook
  useTrackingNavigation(sessionExpired, isLoading, booking, error);

  // Reduced polling frequency with smarter updates
  useEffect(() => {
    if (!bookingId) return;
    
    const interval = setInterval(() => {
      // Only poll if we're not in an error state and the booking exists
      if (!error && booking) {
        loadAllData();
      }
    }, 3000); // Reduced from 2s to 3s
    
    return () => clearInterval(interval);
  }, [bookingId, loadAllData, error, booking]);

  return {
    booking,
    tasks,
    isInspected,
    progress,
    sessionExpired,
    isLoading,
    error
  };
};
