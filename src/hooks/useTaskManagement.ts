
import { useBookingSelection } from "./useBookingSelection";
import { useServiceTasks } from "./useServiceTasks";
import { useBookingStateManager } from "./bookings/useBookingStateManager";
import { syncBookingToSupabase } from "@/services/bookingSyncService";
import { toast } from "sonner";

export const useTaskManagement = () => {
  // Use the specialized hook for booking selection with enhanced features
  const {
    selectedAppointment,
    setSelectedAppointment,
    currentBooking,
    appointments,
    loading,
    selectedDate,
    setSelectedDate,
    searchTerm,
    setSearchTerm
  } = useBookingSelection();
  
  // Use the specialized hook for service tasks management
  const {
    serviceTasks,
    handleUpdateTimeAllocation,
    handleToggleTaskCompletion,
    handleSetActualTime,
    handleSaveServiceProgress
  } = useServiceTasks(selectedAppointment, currentBooking);

  // Use booking state manager for updating booking status
  const { updateBooking } = useBookingStateManager();

  // Handle finishing the job
  const handleFinishJob = async () => {
    if (!currentBooking) return;

    try {
      // Update booking status to finished
      const finishedBooking = {
        ...currentBooking,
        status: "finished" as const
      };

      // Update locally
      await updateBooking(finishedBooking);
      
      // Sync to Supabase
      try {
        await syncBookingToSupabase(finishedBooking);
        console.log('Job completion synced to database');
      } catch (error) {
        console.error('Failed to sync job completion to database:', error);
      }

      toast.success(`Job completed for ${currentBooking.customer}! Booking status updated to finished.`);
      
    } catch (error) {
      console.error('Error finishing job:', error);
      toast.error('Failed to finish job. Please try again.');
    }
  };
  
  return {
    selectedAppointment,
    setSelectedAppointment,
    currentBooking,
    serviceTasks,
    loading,
    appointments,
    selectedDate,
    setSelectedDate,
    searchTerm,
    setSearchTerm,
    handleUpdateTimeAllocation,
    handleToggleTaskCompletion,
    handleSetActualTime,
    handleSaveServiceProgress,
    handleFinishJob
  };
};
