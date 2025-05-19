
import { Booking } from '@/types/booking';
import { useBookingStateManager } from './useBookingStateManager';
import { useBookingStatus } from './useBookingStatus';

export const useBookingManagement = () => {
  const { 
    updateBooking,
    moveBookingToConfirmed
  } = useBookingStateManager();
  
  // Use the new centralized status hook
  const { 
    updateBookingStatus,
    confirmBooking,
    completeBooking
  } = useBookingStatus(updateBooking, moveBookingToConfirmed);

  // Handler for updating booking status
  const handleUpdateStatus = (booking: Booking, newStatus: "confirmed" | "in-progress" | "completed" | "finished") => {
    updateBookingStatus(booking, newStatus);
  };
  
  // Handler for confirming a booking
  const handleConfirmBooking = (booking: Booking) => {
    confirmBooking(booking);
  };
  
  // Handler for completing a booking
  const handleCompleteBooking = (booking: Booking) => {
    completeBooking(booking);
  };

  return {
    handleConfirmBooking,
    handleCompleteBooking,
    handleUpdateStatus
  };
};
