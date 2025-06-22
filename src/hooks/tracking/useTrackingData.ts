
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
        
        // Start session timeout if booking is finished
        if (foundBooking.status === "finished") {
          startSessionTimeout();
        }
      } else {
        // Booking not found, redirect to tracking page
        navigate("/track");
      }
    };
    
    const loadTasks = () => {
      // Load service tasks
      const serviceProgressStr = localStorage.getItem('serviceProgress');
      
      if (serviceProgressStr) {
        const serviceProgress = JSON.parse(serviceProgressStr);
        const bookingProgress = serviceProgress.find((p: any) => p.bookingId === bookingId);
        
        if (bookingProgress && bookingProgress.tasks) {
          setTasks(bookingProgress.tasks);
          
          // Use enhanced progress calculation
          const calculatedProgress = calculateProgress(bookingProgress.tasks);
          setProgress(calculatedProgress);
        }
      }
    };
    
    // Set up polling for real-time updates
    const pollForUpdates = () => {
      loadBookingData();
      loadTasks();
    };
    
    // Initial load
    pollForUpdates();
    
    // Reduced polling interval to 2 seconds for better real-time experience
    const interval = setInterval(pollForUpdates, 2000);
    
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
  }, [bookingId, navigate]);

  // Start a session timeout of 15 minutes for finished bookings
  const startSessionTimeout = () => {
    const timeout = 15 * 60 * 1000; // 15 minutes in milliseconds
    
    // Set a timeout to expire the session
    setTimeout(() => {
      setSessionExpired(true);
    }, timeout);
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
