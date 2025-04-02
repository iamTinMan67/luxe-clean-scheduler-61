
import { Booking } from '@/types/booking';
import { generateInvoice, sendNotification } from '@/utils/bookingUtils';
import { toast } from 'sonner';

export const useBookingActions = (
  pendingBookings: Booking[], 
  setPendingBookings: React.Dispatch<React.SetStateAction<Booking[]>>,
  confirmedBookings: Booking[],
  setConfirmedBookings: React.Dispatch<React.SetStateAction<Booking[]>>
) => {
  // Handle booking confirmation
  const handleConfirmBooking = (booking: Booking) => {
    // Create a confirmed booking
    const confirmedBooking: Booking = {
      ...booking,
      status: "confirmed",
      startTime: booking.time,
      endTime: booking.time 
        ? `${parseInt(booking.time.split(':')[0]) + 2}:${booking.time.split(':')[1]}` 
        : "12:00",
      staff: ["James Carter", "Michael Scott"]
    };
    
    // Add to confirmed bookings
    const updatedConfirmedBookings = [...confirmedBookings, confirmedBooking];
    setConfirmedBookings(updatedConfirmedBookings);
    localStorage.setItem('confirmedBookings', JSON.stringify(updatedConfirmedBookings));
    
    // Remove from pending
    const updatedPendingBookings = pendingBookings.filter(b => b.id !== booking.id);
    setPendingBookings(updatedPendingBookings);
    localStorage.setItem('pendingBookings', JSON.stringify(updatedPendingBookings));
    
    // Generate invoice
    generateInvoice(confirmedBooking);
    
    toast.success("Booking confirmed", {
      description: `Booking for ${booking.customer} has been confirmed.`
    });
  };
  
  // Handle booking deletion
  const handleDeleteBooking = (booking: Booking) => {
    if (booking.status === "pending") {
      // Remove from pending
      const updatedPendingBookings = pendingBookings.filter(b => b.id !== booking.id);
      setPendingBookings(updatedPendingBookings);
      localStorage.setItem('pendingBookings', JSON.stringify(updatedPendingBookings));
    } else {
      // Remove from confirmed
      const updatedConfirmedBookings = confirmedBookings.filter(b => b.id !== booking.id);
      setConfirmedBookings(updatedConfirmedBookings);
      localStorage.setItem('confirmedBookings', JSON.stringify(updatedConfirmedBookings));
    }
    
    toast.success("Booking deleted", {
      description: `Booking for ${booking.customer} has been deleted.`
    });
  };

  // Mark booking as completed
  const handleCompleteBooking = (booking: Booking) => {
    // Update the booking
    const updatedBooking: Booking = {
      ...booking,
      status: "completed"
    };
    
    // Update in confirmed bookings
    const updatedConfirmedBookings = confirmedBookings.map(b => 
      b.id === updatedBooking.id ? updatedBooking : b
    );
    setConfirmedBookings(updatedConfirmedBookings);
    localStorage.setItem('confirmedBookings', JSON.stringify(updatedConfirmedBookings));
    
    // Send completion notification with feedback link
    sendNotification(updatedBooking, "completion");
    
    toast.success("Booking completed", {
      description: `Service for ${updatedBooking.customer} has been marked as completed.`
    });
  };

  return {
    handleConfirmBooking,
    handleDeleteBooking,
    handleCompleteBooking
  };
};
