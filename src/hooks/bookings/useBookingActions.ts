import { Booking } from '@/types/booking';
import { generateInvoice, sendNotification } from '@/utils/bookingUtils';
import { toast } from 'sonner';
import { getStaffNames } from '@/data/staffData';

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
      staff: ["Karl", "Salleah"] // Default assigned staff (we could change this to use staff allocation dialog)
    };
    
    // Ensure date is a Date object
    if (typeof confirmedBooking.date === 'string') {
      confirmedBooking.date = new Date(confirmedBooking.date);
    }
    
    // Add to schedule
    const updatedConfirmedBookings = [...confirmedBookings, confirmedBooking];
    setConfirmedBookings(updatedConfirmedBookings);
    localStorage.setItem('confirmedBookings', JSON.stringify(updatedConfirmedBookings));
    
    // Remove from pending
    const updatedPendingBookings = pendingBookings.filter(b => b.id !== booking.id);
    setPendingBookings(updatedPendingBookings);
    localStorage.setItem('pendingBookings', JSON.stringify(updatedPendingBookings));
    
    // Generate invoice
    generateInvoice(confirmedBooking);
    
    // Also update planner calendar data
    const existingPlannerData = localStorage.getItem('plannerCalendarBookings') || '[]';
    try {
      const plannerBookings = JSON.parse(existingPlannerData);
      plannerBookings.push(confirmedBooking);
      localStorage.setItem('plannerCalendarBookings', JSON.stringify(plannerBookings));
    } catch (e) {
      console.error('Error updating planner calendar:', e);
      localStorage.setItem('plannerCalendarBookings', JSON.stringify([confirmedBooking]));
    }
    
    toast.success("Booking confirmed", {
      description: `Booking for ${booking.customer} has now been accepted. Please check your email and find our link.`
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
      
      // Also remove from planner calendar if present
      try {
        const existingPlannerData = localStorage.getItem('plannerCalendarBookings') || '[]';
        const plannerBookings = JSON.parse(existingPlannerData);
        const updatedPlannerBookings = plannerBookings.filter((b: Booking) => b.id !== booking.id);
        localStorage.setItem('plannerCalendarBookings', JSON.stringify(updatedPlannerBookings));
      } catch (e) {
        console.error('Error removing booking from planner calendar:', e);
      }
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
    
    // Also update in planner calendar if present
    try {
      const existingPlannerData = localStorage.getItem('plannerCalendarBookings') || '[]';
      const plannerBookings = JSON.parse(existingPlannerData);
      const updatedPlannerBookings = plannerBookings.map((b: Booking) => 
        b.id === updatedBooking.id ? updatedBooking : b
      );
      localStorage.setItem('plannerCalendarBookings', JSON.stringify(updatedPlannerBookings));
    } catch (e) {
      console.error('Error updating booking status in planner calendar:', e);
    }
    
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
