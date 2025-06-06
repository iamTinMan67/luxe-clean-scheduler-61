
import { Booking } from '@/types/booking';
import { useBookingMutations } from './useBookingMutations';
import { useBookingStatus } from './useBookingStatus';

export const useBookingManagement = () => {
  const { 
    updateBooking,
    moveBookingToConfirmed
  } = useBookingMutations();
  
  // Use the new centralized status hook
  const { 
    updateBookingStatus,
    confirmBooking,
    finishBooking
  } = useBookingStatus(updateBooking, moveBookingToConfirmed);

  // Handler for updating booking status with proper type constraints (removed "completed")
  const handleUpdateStatus = (booking: Booking, newStatus: "confirmed" | "in-progress" | "finished" | "pending" | "cancelled" | "inspecting" | "inspected") => {
    updateBookingStatus(booking, newStatus);
  };
  
  // Handler for confirming a booking
  const handleConfirmBooking = (booking: Booking) => {
    confirmBooking(booking);
  };
  
  // Handler for finishing a booking (replaces complete)
  const handleFinishBooking = (booking: Booking) => {
    finishBooking(booking);
  };

  return {
    handleConfirmBooking,
    handleFinishBooking,
    handleUpdateStatus
  };
};
