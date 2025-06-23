
import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Booking } from "@/types/booking";
import { ServiceTaskItem } from "@/types/task";
import { trackingDataSync } from "@/services/trackingDataSync";

interface UseTrackingDataReturn {
  booking: Booking | null;
  tasks: ServiceTaskItem[];
  isInspected: boolean;
  progress: number;
  sessionExpired: boolean;
  isLoading: boolean;
  error: string | null;
}

export const useTrackingDataV2 = (bookingId: string): UseTrackingDataReturn => {
  const [booking, setBooking] = useState<Booking | null>(null);
  const [tasks, setTasks] = useState<ServiceTaskItem[]>([]);
  const [isInspected, setIsInspected] = useState(false);
  const [progress, setProgress] = useState(0);
  const [sessionExpired, setSessionExpired] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const lastLoadTime = useRef<number>(0);

  // Enhanced progress calculation with weighted tasks
  const calculateProgress = useCallback((serviceTasks: ServiceTaskItem[]) => {
    if (serviceTasks.length === 0) return 0;
    
    const totalWeight = serviceTasks.reduce((sum, task) => sum + task.allocatedTime, 0);
    const completedWeight = serviceTasks
      .filter(task => task.completed)
      .reduce((sum, task) => sum + task.allocatedTime, 0);
    
    return totalWeight > 0 ? Math.round((completedWeight / totalWeight) * 100) : 0;
  }, []);

  // Generate placeholder tasks for inspecting status
  const generatePlaceholderTasks = useCallback((booking: Booking): ServiceTaskItem[] => {
    return [
      {
        id: 'placeholder-inspection',
        name: 'Vehicle Inspection',
        completed: false,
        allocatedTime: 15
      },
      {
        id: 'placeholder-preparation',
        name: 'Service Preparation',
        completed: false,
        allocatedTime: 10
      },
      {
        id: 'placeholder-setup',
        name: 'Equipment Setup',
        completed: false,
        allocatedTime: 5
      }
    ];
  }, []);

  // Enhanced data loader with consistency validation
  const loadAllData = useCallback(() => {
    console.log('=== Enhanced Loading Tracking Data ===');
    console.log('Booking ID:', bookingId);
    
    // Prevent excessive loading calls
    const now = Date.now();
    if (now - lastLoadTime.current < 500) {
      console.log('Throttling load call - too recent');
      return;
    }
    lastLoadTime.current = now;
    
    setError(null);
    
    try {
      // Get comprehensive tracking data
      const trackingData = trackingDataSync.getTrackingData(bookingId);
      console.log('Tracking data:', trackingData);
      
      // Find booking from either source
      const foundBooking = trackingData.confirmedBooking || trackingData.plannerBooking;
      
      if (!foundBooking) {
        console.log('Booking not found in any localStorage source');
        setError('Booking not found');
        setIsLoading(false);
        return;
      }

      // Validate booking status for tracking
      const validStatuses = ["inspecting", "inspected", "in-progress", "finished"];
      if (!validStatuses.includes(foundBooking.status)) {
        console.log('Invalid booking status for tracking:', foundBooking.status);
        setError(`Booking status "${foundBooking.status}" is not trackable`);
        setIsLoading(false);
        return;
      }

      console.log('Found booking:', foundBooking.customer, foundBooking.status);
      setBooking(foundBooking);
      setIsInspected(foundBooking.status === "inspected" || foundBooking.status === "in-progress" || foundBooking.status === "finished");
      
      // Load service tasks based on booking status
      if (foundBooking.status === "inspecting") {
        // Show placeholder tasks for inspecting status
        const placeholderTasks = generatePlaceholderTasks(foundBooking);
        setTasks(placeholderTasks);
        setProgress(0);
        console.log('Using placeholder tasks for inspecting status');
      } else {
        // Load real service tasks from serviceProgress
        if (trackingData.serviceProgress && trackingData.serviceProgress.tasks) {
          console.log('Found service progress:', trackingData.serviceProgress.tasks.length, 'tasks');
          setTasks(trackingData.serviceProgress.tasks);
          
          // Use the stored progress percentage or calculate it
          const calculatedProgress = trackingData.serviceProgress.progressPercentage || 
                                   calculateProgress(trackingData.serviceProgress.tasks);
          setProgress(calculatedProgress);
          console.log('Progress:', calculatedProgress + '%');
        } else {
          console.log('No service progress found for booking');
          setTasks([]);
          setProgress(0);
        }
      }
      
      // Validate data consistency
      const isConsistent = trackingDataSync.validateDataConsistency(bookingId);
      if (!isConsistent) {
        console.warn('Data consistency issues detected');
      }
      
      // Extended session management
      if (foundBooking.status === "finished") {
        startExtendedSession();
      }
      
      setIsLoading(false);
      console.log('=== Enhanced Data Loading Complete ===');
      
    } catch (error) {
      console.error('Error in enhanced loadAllData:', error);
      setError('Failed to load tracking data');
      setIsLoading(false);
    }
  }, [bookingId, calculateProgress, generatePlaceholderTasks]);

  // Extended session timeout
  const startExtendedSession = useCallback(() => {
    const now = new Date();
    const endOfDay = new Date(now);
    endOfDay.setHours(23, 59, 59, 999);
    
    const timeUntilEndOfDay = endOfDay.getTime() - now.getTime();
    
    setTimeout(() => {
      setSessionExpired(true);
    }, timeUntilEndOfDay);
  }, []);

  // Initial load effect
  useEffect(() => {
    if (bookingId) {
      loadAllData();
    }
  }, [bookingId, loadAllData]);

  // Enhanced real-time event listeners
  useEffect(() => {
    const handleSyncEvents = (event: CustomEvent) => {
      console.log('Real-time sync event received:', event.type, event.detail);
      
      if (event.detail.bookingId === bookingId) {
        console.log('Event matches current booking, refreshing data');
        loadAllData();
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
  }, [bookingId, loadAllData]);

  // Storage change listener with throttling
  useEffect(() => {
    let throttleTimeout: NodeJS.Timeout;
    
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'serviceProgress' || e.key === 'confirmedBookings' || e.key === 'plannerCalendarBookings' || e.key === 'trackingProgress') {
        console.log('Storage change detected for key:', e.key);
        
        // Throttle storage events to prevent excessive updates
        clearTimeout(throttleTimeout);
        throttleTimeout = setTimeout(() => {
          loadAllData();
        }, 300);
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearTimeout(throttleTimeout);
    };
  }, [loadAllData]);

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

  // Redirect handlers
  useEffect(() => {
    if (sessionExpired) {
      navigate("/track");
    }
  }, [sessionExpired, navigate]);

  useEffect(() => {
    if (!isLoading && !booking && !error) {
      navigate("/track");
    }
  }, [isLoading, booking, error, navigate]);

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
