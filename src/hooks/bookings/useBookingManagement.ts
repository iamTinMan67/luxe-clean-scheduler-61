
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
    completeBooking
  } = useBookingStatus(updateBooking, moveBookingToConfirmed);

  // Handler for updating booking status with proper type constraints
  const handleUpdateStatus = (booking: Booking, newStatus: "confirmed" | "in-progress" | "completed" | "finished" | "pending" | "cancelled") => {
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
