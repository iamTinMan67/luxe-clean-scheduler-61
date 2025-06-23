
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Booking } from "@/types/booking";
import { ServiceTaskItem } from "@/types/task";

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

  // Unified data loader function
  const loadAllData = useCallback(() => {
    console.log('=== Loading Tracking Data ===');
    console.log('Booking ID:', bookingId);
    setError(null);
    
    try {
      // Load booking from all possible sources
      const confirmedBookingsStr = localStorage.getItem('confirmedBookings');
      const plannerBookingsStr = localStorage.getItem('plannerCalendarBookings');
      
      let foundBooking: Booking | null = null;
      
      // Check confirmed bookings first
      if (confirmedBookingsStr) {
        try {
          const confirmedBookings = JSON.parse(confirmedBookingsStr);
          foundBooking = confirmedBookings.find((b: Booking) => b.id === bookingId) || null;
          if (foundBooking) {
            console.log('Found booking in confirmedBookings:', foundBooking.customer, foundBooking.status);
          }
        } catch (e) {
          console.error('Error parsing confirmedBookings:', e);
        }
      }
      
      // Check planner bookings if not found
      if (!foundBooking && plannerBookingsStr) {
        try {
          const plannerBookings = JSON.parse(plannerBookingsStr);
          foundBooking = plannerBookings.find((b: Booking) => b.id === bookingId) || null;
          if (foundBooking) {
            console.log('Found booking in plannerCalendarBookings:', foundBooking.customer, foundBooking.status);
          }
        } catch (e) {
          console.error('Error parsing plannerCalendarBookings:', e);
        }
      }
      
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
        // Load real service tasks from localStorage
        const serviceProgressStr = localStorage.getItem('serviceProgress');
        
        if (serviceProgressStr) {
          try {
            const serviceProgress = JSON.parse(serviceProgressStr);
            const bookingProgress = serviceProgress.find((p: any) => p.bookingId === bookingId);
            
            if (bookingProgress && bookingProgress.tasks && Array.isArray(bookingProgress.tasks)) {
              console.log('Found service progress:', bookingProgress.tasks.length, 'tasks');
              setTasks(bookingProgress.tasks);
              
              // Calculate progress using enhanced method
              const calculatedProgress = calculateProgress(bookingProgress.tasks);
              setProgress(calculatedProgress);
              console.log('Calculated progress:', calculatedProgress + '%');
            } else {
              console.log('No service progress found for booking, using empty tasks');
              setTasks([]);
              setProgress(0);
            }
          } catch (e) {
            console.error('Error parsing serviceProgress:', e);
            setTasks([]);
            setProgress(0);
          }
        } else {
          console.log('No serviceProgress in localStorage');
          setTasks([]);
          setProgress(0);
        }
      }
      
      // Extended session management
      if (foundBooking.status === "finished") {
        startExtendedSession();
      }
      
      setIsLoading(false);
      console.log('=== Data Loading Complete ===');
      
    } catch (error) {
      console.error('Error in loadAllData:', error);
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
    loadAllData();
  }, [loadAllData]);

  // Real-time updates via storage events
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'serviceProgress' || e.key === 'confirmedBookings' || e.key === 'plannerCalendarBookings') {
        console.log('Storage change detected for key:', e.key);
        loadAllData();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [loadAllData]);

  // Custom event listener for real-time updates
  useEffect(() => {
    const handleProgressUpdate = (event: CustomEvent) => {
      if (event.detail.bookingId === bookingId) {
        console.log('Real-time progress update received:', event.detail);
        loadAllData();
      }
    };

    window.addEventListener('serviceProgressUpdate', handleProgressUpdate as EventListener);
    return () => {
      window.removeEventListener('serviceProgressUpdate', handleProgressUpdate as EventListener);
    };
  }, [bookingId, loadAllData]);

  // Polling for updates every 2 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      loadAllData();
    }, 2000);
    
    return () => clearInterval(interval);
  }, [loadAllData]);

  // Redirect if session expired
  useEffect(() => {
    if (sessionExpired) {
      navigate("/track");
    }
  }, [sessionExpired, navigate]);

  // Redirect if booking not found and loading complete
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
