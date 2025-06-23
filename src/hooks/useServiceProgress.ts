
import { useToast } from "@/hooks/use-toast";
import { Booking } from "@/types/booking";
import { ServiceTaskItem } from "@/types/task";
import { useDataSynchronization } from "./tracking/useDataSynchronization";

export const useServiceProgress = () => {
  const { toast } = useToast();
  const { syncServiceProgress, syncBookingData } = useDataSynchronization();
  
  // Save service progress with enhanced synchronization
  const saveServiceProgress = (bookingId: string, serviceTasks: ServiceTaskItem[]) => {
    if (!bookingId) {
      console.error('No booking ID provided for saveServiceProgress');
      return;
    }

    console.log('=== Enhanced Save Service Progress ===');
    console.log('Booking ID:', bookingId);
    console.log('Tasks:', serviceTasks.length);
    
    const success = syncServiceProgress(bookingId, serviceTasks);
    
    if (success) {
      // Check if all tasks are completed and update booking status
      const allTasksCompleted = serviceTasks.every(task => task.completed);
      
      if (allTasksCompleted) {
        // Find and update the booking status
        const confirmedBookingsStr = localStorage.getItem('confirmedBookings');
        const plannerBookingsStr = localStorage.getItem('plannerCalendarBookings');
        
        let foundBooking: Booking | null = null;
        
        if (confirmedBookingsStr) {
          const confirmedBookings = JSON.parse(confirmedBookingsStr);
          foundBooking = confirmedBookings.find((b: Booking) => b.id === bookingId);
        }
        
        if (!foundBooking && plannerBookingsStr) {
          const plannerBookings = JSON.parse(plannerBookingsStr);
          foundBooking = plannerBookings.find((b: Booking) => b.id === bookingId);
        }
        
        if (foundBooking && foundBooking.status !== "finished") {
          const updatedBooking = { ...foundBooking, status: "finished" as const };
          syncBookingData(updatedBooking);
          console.log('Updated booking status to finished');
        }
      }
    }
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
