
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
          
          // Calculate progress based on task completion
          const completedTasks = bookingProgress.tasks.filter((task: ServiceTaskItem) => task.completed).length;
          const totalTasks = bookingProgress.tasks.length;
          const calculatedProgress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
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
    
    // Poll every 5 seconds for updates
    const interval = setInterval(pollForUpdates, 5000);
    
    return () => clearInterval(interval);
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
