
import { useBookingSelection } from "./useBookingSelection";
import { useServiceTasksV2 } from "./useServiceTasksV2";
import { useBookingStateManager } from "./bookings/useBookingStateManager";
import { syncBookingToSupabase } from "@/services/bookingSyncService";
import { generateInvoice } from "@/utils/bookingUtils";
import { useDataSynchronization } from "./tracking/useDataSynchronization";
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
  
  // Use the enhanced V2 service tasks management
  const {
    serviceTasks,
    handleUpdateTimeAllocation,
    handleToggleTaskCompletion,
    handleSetActualTime,
    handleSaveServiceProgress
  } = useServiceTasksV2(selectedAppointment, currentBooking);

  // Use enhanced data synchronization
  const { syncBookingData } = useDataSynchronization();
  
  // Use booking state manager for updating booking status
  const { updateBooking } = useBookingStateManager();

  // Handle finishing the job with enhanced synchronization
  const handleFinishJob = async () => {
    if (!currentBooking) return;

    try {
      console.log("=== Enhanced Finishing Job ===");
      console.log("Booking:", currentBooking.customer, currentBooking.id);
      
      // Update booking status to finished
      const finishedBooking = {
        ...currentBooking,
        status: "finished" as const
      };

      // Update locally using enhanced sync
      const syncSuccess = syncBookingData(finishedBooking);
      if (syncSuccess) {
        console.log('Local booking sync successful');
      }
      
      // Also use the existing booking state manager
      await updateBooking(finishedBooking);
      
      // Sync to Supabase
      try {
        await syncBookingToSupabase(finishedBooking);
        console.log('Job completion synced to database');
      } catch (error) {
        console.error('Failed to sync job completion to database:', error);
      }

      // Generate invoice for the finished job
      try {
        const invoice = generateInvoice(finishedBooking);
        console.log('Invoice generated:', invoice);
        toast.success(`Job completed for ${currentBooking.customer}! Invoice generated and booking status updated to finished.`);
      } catch (error) {
        console.error('Failed to generate invoice:', error);
        toast.success(`Job completed for ${currentBooking.customer}! Booking status updated to finished.`);
        toast.error('Failed to generate invoice. Please create manually.');
      }
      
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
