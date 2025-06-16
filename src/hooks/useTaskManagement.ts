
import { useBookingSelection } from "./useBookingSelection";
import { useServiceTasks } from "./useServiceTasks";
import { useBookingStateManager } from "./bookings/useBookingStateManager";
import { syncBookingToSupabase } from "@/services/bookingSyncService";
import { generateInvoice } from "@/utils/bookingUtils";
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
      console.log("Finishing job for booking:", currentBooking.customer);
      
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
