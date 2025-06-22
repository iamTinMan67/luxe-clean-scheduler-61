import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Booking } from "@/types/booking";
import { ServiceTaskItem } from "@/types/task";

interface UseTrackingDataReturn {
  booking: Booking | null;
  tasks: ServiceTaskItem[];
  isInspected: boolean;
  progress: number;
  sessionExpired: boolean;
}

export const useTrackingData = (bookingId: string): UseTrackingDataReturn => {
  const [booking, setBooking] = useState<Booking | null>(null);
  const [tasks, setTasks] = useState<ServiceTaskItem[]>([]);
  const [isInspected, setIsInspected] = useState(false);
  const [progress, setProgress] = useState(0);
  const [sessionExpired, setSessionExpired] = useState(false);
  const navigate = useNavigate();

  // Enhanced progress calculation with weighted tasks
  const calculateProgress = (serviceTasks: ServiceTaskItem[]) => {
    if (serviceTasks.length === 0) return 0;
    
    const totalWeight = serviceTasks.reduce((sum, task) => sum + task.allocatedTime, 0);
    const completedWeight = serviceTasks
      .filter(task => task.completed)
      .reduce((sum, task) => sum + task.allocatedTime, 0);
    
    return totalWeight > 0 ? Math.round((completedWeight / totalWeight) * 100) : 0;
  };

  // Generate placeholder tasks for inspecting status
  const generatePlaceholderTasks = (booking: Booking): ServiceTaskItem[] => {
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
  };

  // Load booking and tasks
  useEffect(() => {
    const loadBookingData = () => {
      // Load from confirmedBookings and plannerCalendarBookings
      const confirmedBookingsStr = localStorage.getItem('confirmedBookings');
      const plannerBookingsStr = localStorage.getItem('plannerCalendarBookings');
      
      let foundBooking: Booking | null = null;
      
      if (confirmedBookingsStr) {
        const confirmedBookings = JSON.parse(confirmedBookingsStr);
        foundBooking = confirmedBookings.find((b: Booking) => b.id === bookingId) || null;
      }
      
      if (!foundBooking && plannerBookingsStr) {
        const plannerBookings = JSON.parse(plannerBookingsStr);
        foundBooking = plannerBookings.find((b: Booking) => b.id === bookingId) || null;
      }
      
      // Check if booking found and has a valid status
      if (foundBooking) {
        setBooking(foundBooking);
        
        // Check if the booking is inspected
        if (foundBooking.status === "inspected") {
          setIsInspected(true);
        }
        
        // Extended session management - keep session active until end of day for finished jobs
        if (foundBooking.status === "finished") {
          startExtendedSession();
        }
      } else {
        // Booking not found, redirect to tracking page
        navigate("/track");
      }
    };
    
    const loadTasks = () => {
      // Load service tasks
      const serviceProgressStr = localStorage.getItem('serviceProgress');
      
      if (serviceProgressStr && booking) {
        const serviceProgress = JSON.parse(serviceProgressStr);
        const bookingProgress = serviceProgress.find((p: any) => p.bookingId === bookingId);
        
        if (bookingProgress && bookingProgress.tasks) {
          setTasks(bookingProgress.tasks);
          
          // Use enhanced progress calculation
          const calculatedProgress = calculateProgress(bookingProgress.tasks);
          setProgress(calculatedProgress);
        } else if (booking.status === "inspecting") {
          // Show placeholder tasks for inspecting status
          const placeholderTasks = generatePlaceholderTasks(booking);
          setTasks(placeholderTasks);
          setProgress(0);
        }
      } else if (booking && booking.status === "inspecting") {
        // Show placeholder tasks for inspecting status when no service progress exists
        const placeholderTasks = generatePlaceholderTasks(booking);
        setTasks(placeholderTasks);
        setProgress(0);
      }
    };
    
    // Set up polling for real-time updates
    const pollForUpdates = () => {
      loadBookingData();
      loadTasks();
    };
    
    // Initial load
    pollForUpdates();
    
    // Reduced polling interval to 1 second for better real-time experience
    const interval = setInterval(pollForUpdates, 1000);
    
    // Listen for localStorage changes for immediate updates
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'serviceProgress' || e.key === 'confirmedBookings' || e.key === 'plannerCalendarBookings') {
        console.log('Storage change detected, updating tracking data');
        pollForUpdates();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [bookingId, navigate, booking]);

  // Extended session timeout - keep active until end of day for finished bookings
  const startExtendedSession = () => {
    const now = new Date();
    const endOfDay = new Date(now);
    endOfDay.setHours(23, 59, 59, 999); // End of current day
    
    const timeUntilEndOfDay = endOfDay.getTime() - now.getTime();
    
    // Set a timeout to expire the session at end of day
    setTimeout(() => {
      setSessionExpired(true);
    }, timeUntilEndOfDay);
  };
  
  // Redirect if session expired
  useEffect(() => {
    if (sessionExpired) {
      navigate("/track");
    }
  }, [sessionExpired, navigate]);

  return {
    booking,
    tasks,
    isInspected,
    progress,
    sessionExpired
  };
};
