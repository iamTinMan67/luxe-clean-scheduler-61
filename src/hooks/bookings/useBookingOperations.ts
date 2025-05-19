
import { Booking } from '@/types/booking';
import { toast } from 'sonner';
import { isSameDay } from 'date-fns';
import { useBookingStateManager } from './useBookingStateManager';

export const useBookingOperations = () => {
  const { 
    pendingBookings, 
    confirmedBookings, 
    date,
    updateBooking,
    deleteBooking
  } = useBookingStateManager();

  // Get bookings for the selected date
  const getBookingsForDate = () => {
    if (!date) return [];
    
    return [...confirmedBookings, ...pendingBookings].filter(booking => {
      const bookingDate = booking.date instanceof Date ? booking.date : new Date(booking.date);
      return isSameDay(bookingDate, date);
    }).sort((a, b) => {
      // Sort by time
      const timeA = a.startTime || a.time || '00:00';
      const timeB = b.startTime || b.time || '00:00';
      return timeA.localeCompare(timeB);
    });
  };
  
  // Handler for deleting a booking
  const handleDeleteBooking = (booking: Booking) => {
    deleteBooking(booking);
    toast.success(`${booking.customer}'s booking has been deleted.`);
  };
  
  // Handler for changing a package
  const handlePackageChange = (booking: Booking, newPackage: string) => {
    const updatedBooking = { ...booking, packageType: newPackage };
    updateBooking(updatedBooking);
    toast.success(`${booking.customer}'s package has been updated to ${newPackage}.`);
  };
  
  // Handler for rescheduling a booking
  const handleReschedule = (booking: Booking, newDate: Date) => {
    const updatedBooking = { ...booking, date: newDate };
    updateBooking(updatedBooking);
    toast.success(`${booking.customer}'s booking has been rescheduled to ${newDate.toLocaleDateString()}.`);
  };

  return {
    getBookingsForDate,
    handleDeleteBooking,
    handlePackageChange,
    handleReschedule
  };
};
