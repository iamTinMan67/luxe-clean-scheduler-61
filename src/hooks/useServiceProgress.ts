
import { useToast } from "@/hooks/use-toast";
import { Booking } from "@/types/booking";
import { ServiceTaskItem } from "@/types/task";
import { updateTrackingProgress } from "@/utils/taskUtils";

export const useServiceProgress = () => {
  const { toast } = useToast();
  
  // Save service progress to localStorage
  const saveServiceProgress = (bookingId: string, serviceTasks: ServiceTaskItem[]) => {
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

  // Function to save progress with toast notification
  const saveProgressWithNotification = (bookingId: string, serviceTasks: ServiceTaskItem[]) => {
    if (bookingId) {
      saveServiceProgress(bookingId, serviceTasks);
      toast({
        title: "Service progress saved",
        description: `All progress has been saved and tracking is updated`,
      });
    }
  };

  return {
    saveServiceProgress,
    saveProgressWithNotification
  };
};
