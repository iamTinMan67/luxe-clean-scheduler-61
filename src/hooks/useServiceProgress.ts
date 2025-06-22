
import { useToast } from "@/hooks/use-toast";
import { Booking } from "@/types/booking";
import { ServiceTaskItem } from "@/types/task";
import { updateTrackingProgress } from "@/utils/taskUtils";

export const useServiceProgress = () => {
  const { toast } = useToast();
  
  // Save service progress to localStorage with enhanced tracking
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
    
    // Enhanced service tasks progress with timestamps
    const serviceProgress = {
      bookingId: bookingId,
      tasks: serviceTasks.map(task => ({
        ...task,
        completedAt: task.completed && !task.completedAt ? new Date().toISOString() : task.completedAt,
        updatedAt: new Date().toISOString()
      })),
      lastUpdated: new Date().toISOString(),
      progressPercentage: Math.round((serviceTasks.filter(t => t.completed).length / serviceTasks.length) * 100)
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
    
    // Trigger a custom event for real-time updates
    window.dispatchEvent(new CustomEvent('serviceProgressUpdate', {
      detail: { bookingId, progress: serviceProgress.progressPercentage, status: newStatus }
    }));
    
    console.log(`Service progress saved for ${bookingId}: ${serviceProgress.progressPercentage}% complete`);
  };

  // Function to save progress with enhanced notification
  const saveProgressWithNotification = (bookingId: string, serviceTasks: ServiceTaskItem[]) => {
    if (bookingId) {
      const completedTasks = serviceTasks.filter(task => task.completed).length;
      const totalTasks = serviceTasks.length;
      const progressPercentage = Math.round((completedTasks / totalTasks) * 100);
      
      saveServiceProgress(bookingId, serviceTasks);
      
      toast({
        title: "Service progress updated",
        description: `Progress: ${completedTasks}/${totalTasks} tasks complete (${progressPercentage}%)`,
      });
    }
  };

  return {
    saveServiceProgress,
    saveProgressWithNotification
  };
};
