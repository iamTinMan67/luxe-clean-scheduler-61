
import { useToast } from "@/hooks/use-toast";
import { Booking } from "@/types/booking";
import { ServiceTaskItem } from "@/types/task";
import { trackingDataSync } from '@/services/trackingDataSync';

export const useServiceProgress = () => {
  const { toast } = useToast();
  
  // Enhanced save service progress with comprehensive synchronization
  const saveServiceProgress = (bookingId: string, serviceTasks: ServiceTaskItem[]) => {
    if (!bookingId) {
      console.error('No booking ID provided for saveServiceProgress');
      return;
    }

    console.log('=== Enhanced Save Service Progress ===');
    console.log('Booking ID:', bookingId);
    console.log('Tasks:', serviceTasks.length);
    
    const success = trackingDataSync.syncServiceProgress(bookingId, serviceTasks);
    
    if (success) {
      console.log('Enhanced save service progress completed successfully');
    } else {
      console.error('Enhanced save service progress failed');
    }
    
    return success;
  };

  // Function to save progress with enhanced notification
  const saveProgressWithNotification = (bookingId: string, serviceTasks: ServiceTaskItem[]) => {
    if (bookingId) {
      const completedTasks = serviceTasks.filter(task => task.completed).length;
      const totalTasks = serviceTasks.length;
      const progressPercentage = Math.round((completedTasks / totalTasks) * 100);
      
      const success = saveServiceProgress(bookingId, serviceTasks);
      
      if (success) {
        toast({
          title: "Service progress updated",
          description: `Progress: ${completedTasks}/${totalTasks} tasks complete (${progressPercentage}%)`,
        });
      } else {
        toast({
          title: "Update failed",
          description: "Failed to save service progress. Please try again.",
          variant: "destructive"
        });
      }
    }
  };

  return {
    saveServiceProgress,
    saveProgressWithNotification
  };
};
