
import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { Booking } from "@/types/booking";
import { ServiceTaskItem } from "@/types/task";
import { packageOptions, additionalServices } from "@/data/servicePackageData";
import { generateServiceTasksFromPackage, loadServiceTasksProgress, updateTrackingProgress } from "@/utils/taskUtils";

export const useServiceTasks = (selectedBookingId: string, currentBooking: Booking | null) => {
  const [serviceTasks, setServiceTasks] = useState<ServiceTaskItem[]>([]);
  const { toast } = useToast();
  
  // Generate service tasks when booking changes
  useEffect(() => {
    if (currentBooking) {
      const generatedTasks = generateServiceTasksFromPackage(currentBooking, packageOptions, additionalServices);
      const tasksWithProgress = loadServiceTasksProgress(generatedTasks, currentBooking.id);
      setServiceTasks(tasksWithProgress);
    } else {
      setServiceTasks([]);
    }
  }, [currentBooking]);

  // Handle updating time allocation
  const handleUpdateTimeAllocation = (taskId: string, newTime: number) => {
    setServiceTasks(
      serviceTasks.map(task => 
        task.id === taskId ? { ...task, allocatedTime: newTime } : task
      )
    );
  };

  // Handle toggling task completion
  const handleToggleTaskCompletion = (taskId: string) => {
    setServiceTasks(
      serviceTasks.map(task => 
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
    
    // Auto-save progress after each change
    if (currentBooking) {
      saveServiceProgress(currentBooking.id);
    }
  };

  // Handle setting actual time spent
  const handleSetActualTime = (taskId: string, time: number) => {
    setServiceTasks(
      serviceTasks.map(task => 
        task.id === taskId ? { ...task, actualTime: time } : task
      )
    );
    
    // Auto-save progress after each change
    if (currentBooking) {
      saveServiceProgress(currentBooking.id);
    }
  };

  // Handle saving service progress
  const saveServiceProgress = (bookingId: string) => {
    if (!bookingId) return;

    // Check if all tasks are completed
    const allTasksCompleted = serviceTasks.every(task => task.completed);
    const newStatus = allTasksCompleted ? "completed" : "in-progress";
    
    // Update booking status in localStorage
    const confirmedBookings = JSON.parse(localStorage.getItem('confirmedBookings') || '[]');
    const updatedBookings = confirmedBookings.map((booking: Booking) => {
      if (booking.id === bookingId) {
        return {
          ...booking,
          status: newStatus
        };
      }
      return booking;
    });
    
    localStorage.setItem('confirmedBookings', JSON.stringify(updatedBookings));
    
    // Also update in planner calendar bookings if it exists there
    const plannerBookings = JSON.parse(localStorage.getItem('plannerCalendarBookings') || '[]');
    const updatedPlannerBookings = plannerBookings.map((booking: Booking) => {
      if (booking.id === bookingId) {
        return {
          ...booking,
          status: newStatus
        };
      }
      return booking;
    });
    
    localStorage.setItem('plannerCalendarBookings', JSON.stringify(updatedPlannerBookings));
    
    // Save service tasks progress to localStorage
    const serviceProgress = {
      bookingId: bookingId,
      tasks: serviceTasks,
      lastUpdated: new Date().toISOString()
    };
    
    const savedProgress = JSON.parse(localStorage.getItem('serviceProgress') || '[]');
    const existingProgressIndex = savedProgress.findIndex((p: any) => p.bookingId === bookingId);
    
    if (existingProgressIndex >= 0) {
      savedProgress[existingProgressIndex] = serviceProgress;
    } else {
      savedProgress.push(serviceProgress);
    }
    
    localStorage.setItem('serviceProgress', JSON.stringify(savedProgress));
    
    // Update progress percentage for Track My Valet feature
    updateTrackingProgress(bookingId, serviceTasks);
  };

  const handleSaveServiceProgress = () => {
    if (currentBooking) {
      saveServiceProgress(currentBooking.id);
      toast({
        title: "Service progress saved",
        description: `All progress has been saved and tracking is updated`,
      });
    }
  };

  return {
    serviceTasks,
    handleUpdateTimeAllocation,
    handleToggleTaskCompletion,
    handleSetActualTime,
    handleSaveServiceProgress
  };
};
