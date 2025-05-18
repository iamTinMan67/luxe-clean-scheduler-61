
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

  // Get all bookings (both pending and confirmed) for the selected date
  const getBookingsForDate = (): Booking[] => {
    const allBookings = [...pendingBookings, ...confirmedBookings];
    return filterBookingsByDate(date, allBookings);
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
