
import { ServiceTaskItem } from "@/types/task";
import { useToast } from "@/hooks/use-toast";

export const useProgressTracking = (currentBooking: any) => {
  const { toast } = useToast();

  // Update tracking progress for the customer-facing progress page
  const updateTrackingProgress = (bookingId: string, tasks: ServiceTaskItem[]) => {
    const completedTasks = tasks.filter(task => task.completed).length;
    const totalTasks = tasks.length;
    const progressPercentage = Math.round((completedTasks / totalTasks) * 100);
    
    // Update booking progress
    const confirmedBookings = JSON.parse(localStorage.getItem('confirmedBookings') || '[]');
    const updatedBookings = confirmedBookings.map((booking: any) => {
      if (booking.id === bookingId) {
        return {
          ...booking,
          progressPercentage: progressPercentage
        };
      }
      return booking;
    });
    
    localStorage.setItem('confirmedBookings', JSON.stringify(updatedBookings));
    
    // Map tasks to booking steps for the progress page
    const bookingSteps = tasks.map((task, index) => ({
      id: index + 1,
      name: task.name,
      completed: task.completed,
      time: task.completed ? new Date().toISOString() : undefined,
      estimatedTime: `${task.allocatedTime} minutes`
    }));
    
    // Store steps for the progress tracking page
    const progressData = {
      bookingId,
      steps: bookingSteps,
      updatedAt: new Date().toISOString()
    };
    
    const savedProgressData = JSON.parse(localStorage.getItem('bookingProgressData') || '[]');
    const existingDataIndex = savedProgressData.findIndex((p: any) => p.bookingId === bookingId);
    
    if (existingDataIndex >= 0) {
      savedProgressData[existingDataIndex] = progressData;
    } else {
      savedProgressData.push(progressData);
    }
    
    localStorage.setItem('bookingProgressData', JSON.stringify(savedProgressData));
  };

  // Save service progress to localStorage
  const saveServiceProgress = (serviceTasks: ServiceTaskItem[]) => {
    if (!currentBooking) return;

    // Check if all tasks are completed
    const allTasksCompleted = serviceTasks.every(task => task.completed);
    const newStatus = allTasksCompleted ? "completed" : "in-progress";
    
    // Update booking status in localStorage
    const confirmedBookings = JSON.parse(localStorage.getItem('confirmedBookings') || '[]');
    const updatedBookings = confirmedBookings.map((booking: any) => {
      if (booking.id === currentBooking.id) {
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
    const updatedPlannerBookings = plannerBookings.map((booking: any) => {
      if (booking.id === currentBooking.id) {
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
      bookingId: currentBooking.id,
      tasks: serviceTasks,
      lastUpdated: new Date().toISOString()
    };
    
    const savedProgress = JSON.parse(localStorage.getItem('serviceProgress') || '[]');
    const existingProgressIndex = savedProgress.findIndex((p: any) => p.bookingId === currentBooking.id);
    
    if (existingProgressIndex >= 0) {
      savedProgress[existingProgressIndex] = serviceProgress;
    } else {
      savedProgress.push(serviceProgress);
    }
    
    localStorage.setItem('serviceProgress', JSON.stringify(savedProgress));
    
    // Update progress percentage for Track My Valet feature
    updateTrackingProgress(currentBooking.id, serviceTasks);
  };

  const handleSaveServiceProgress = (serviceTasks: ServiceTaskItem[]) => {
    saveServiceProgress(serviceTasks);
    toast({
      title: "Service progress saved",
      description: `All progress has been saved and tracking is updated`,
    });
  };

  return {
    updateTrackingProgress,
    saveServiceProgress,
    handleSaveServiceProgress
  };
};
