
import { useBookingStateManager } from './useBookingStateManager';
import { useBookingFiltering } from './useBookingFiltering';
import { Booking } from '@/types/booking';
import { toast } from 'sonner';

export const useBookingOperations = () => {
  const {
    pendingBookings,
    confirmedBookings,
    date,
    setDate,
    updateBooking,
    deleteBooking
  } = useBookingStateManager();
  
  const { getBookingsForDate: filterBookingsByDate } = useBookingFiltering();

  // Get only confirmed bookings for the selected date
  // This ensures pending bookings are not shown in the Schedule View
  const getBookingsForDate = (): Booking[] => {
    // Only use confirmed bookings for the schedule view
    return filterBookingsByDate(date, confirmedBookings);
  };

  // Delete a booking
  const handleDeleteBooking = (booking: Booking) => {
    deleteBooking(booking);
    toast.success(`Booking for ${booking.customer} has been deleted.`);
  };

  // Update package type
  const handlePackageChange = (booking: Booking, newPackage: string) => {
    const updatedBooking = {
      ...booking,
      packageType: newPackage
    };
    
    updateBooking(updatedBooking);
    toast.success(`Package updated to ${newPackage} for ${booking.customer}`);
  };

  // Reschedule a booking
  const handleReschedule = (booking: Booking, newDate: Date) => {
    const updatedBooking = {
      ...booking,
      date: newDate
    };
    
    updateBooking(updatedBooking);
    toast.success(`Booking for ${booking.customer} has been rescheduled.`);
  };

  return {
    getBookingsForDate,
    handleDeleteBooking,
    handlePackageChange,
    handleReschedule
  };
};
