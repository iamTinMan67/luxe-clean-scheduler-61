
import { Booking } from '@/types/booking';
import { toast } from 'sonner';
import { isSameDay } from 'date-fns';

export const useBookingOperations = (
  date: Date | undefined,
  pendingBookings: Booking[],
  setPendingBookings: React.Dispatch<React.SetStateAction<Booking[]>>,
  confirmedBookings: Booking[],
  setConfirmedBookings: React.Dispatch<React.SetStateAction<Booking[]>>
) => {
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
    const isConfirmed = booking.status === 'confirmed' || booking.status === 'in-progress' || booking.status === 'completed';
    
    if (isConfirmed) {
      // Remove from confirmed bookings
      const updatedConfirmed = confirmedBookings.filter(b => b.id !== booking.id);
      setConfirmedBookings(updatedConfirmed);
      localStorage.setItem('confirmedBookings', JSON.stringify(updatedConfirmed));
    } else {
      // Remove from pending bookings
      const updatedPending = pendingBookings.filter(b => b.id !== booking.id);
      setPendingBookings(updatedPending);
      localStorage.setItem('pendingBookings', JSON.stringify(updatedPending));
    }
    
    toast.success(`${booking.customer}'s booking has been deleted.`);
  };
  
  // Handler for changing a package
  const handlePackageChange = (booking: Booking, newPackage: string) => {
    const isConfirmed = booking.status === 'confirmed' || booking.status === 'in-progress' || booking.status === 'completed';
    
    if (isConfirmed) {
      // Update in confirmed bookings
      const updatedConfirmed = confirmedBookings.map(b => 
        b.id === booking.id ? { ...b, packageType: newPackage } : b
      );
      
      setConfirmedBookings(updatedConfirmed);
      localStorage.setItem('confirmedBookings', JSON.stringify(updatedConfirmed));
    } else {
      // Update in pending bookings
      const updatedPending = pendingBookings.map(b => 
        b.id === booking.id ? { ...b, packageType: newPackage } : b
      );
      
      setPendingBookings(updatedPending);
      localStorage.setItem('pendingBookings', JSON.stringify(updatedPending));
    }
    
    toast.success(`${booking.customer}'s package has been updated to ${newPackage}.`);
  };
  
  // Handler for rescheduling a booking
  const handleReschedule = (booking: Booking, newDate: Date) => {
    const isConfirmed = booking.status === 'confirmed' || booking.status === 'in-progress' || booking.status === 'completed';
    
    if (isConfirmed) {
      // Update in confirmed bookings
      const updatedConfirmed = confirmedBookings.map(b => 
        b.id === booking.id ? { ...b, date: newDate } : b
      );
      
      setConfirmedBookings(updatedConfirmed);
      localStorage.setItem('confirmedBookings', JSON.stringify(updatedConfirmed));
    } else {
      // Update in pending bookings
      const updatedPending = pendingBookings.map(b => 
        b.id === booking.id ? { ...b, date: newDate } : b
      );
      
      setPendingBookings(updatedPending);
      localStorage.setItem('pendingBookings', JSON.stringify(updatedPending));
    }
    
    toast.success(`${booking.customer}'s booking has been rescheduled to ${newDate.toLocaleDateString()}.`);
  };

  return {
    getBookingsForDate,
    handleDeleteBooking,
    handlePackageChange,
    handleReschedule
  };
};
