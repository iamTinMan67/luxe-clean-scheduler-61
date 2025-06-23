
import { useEffect, useCallback } from "react";

export const useTrackingEventListeners = (
  bookingId: string,
  onDataChange: () => void
) => {
  // Enhanced real-time event listeners
  useEffect(() => {
    const handleSyncEvents = (event: CustomEvent) => {
      console.log('Real-time sync event received:', event.type, event.detail);
      
      if (event.detail.bookingId === bookingId) {
        console.log('Event matches current booking, refreshing data');
        onDataChange();
      }
    };

    // Listen to both new and legacy events
    const eventTypes = ['booking-updated', 'service-progress-updated', 'serviceProgressUpdate'];
    
    eventTypes.forEach(eventType => {
      window.addEventListener(eventType, handleSyncEvents as EventListener);
    });
    
    return () => {
      eventTypes.forEach(eventType => {
        window.removeEventListener(eventType, handleSyncEvents as EventListener);
      });
    };
  }, [bookingId, onDataChange]);

  // Storage change listener with throttling
  useEffect(() => {
    let throttleTimeout: NodeJS.Timeout;
    
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'serviceProgress' || e.key === 'confirmedBookings' || e.key === 'plannerCalendarBookings' || e.key === 'trackingProgress') {
        console.log('Storage change detected for key:', e.key);
        
        // Throttle storage events to prevent excessive updates
        clearTimeout(throttleTimeout);
        throttleTimeout = setTimeout(() => {
          onDataChange();
        }, 300);
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearTimeout(throttleTimeout);
    };
  }, [onDataChange]);
};
