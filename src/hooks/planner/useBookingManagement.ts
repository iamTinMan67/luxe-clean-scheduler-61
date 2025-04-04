
import { Booking, validateBookingStatus } from '@/types/booking';
import { toast } from "sonner";
import { generateInvoice, sendNotification } from '@/utils/bookingUtils';

export const useBookingManagement = (
  pendingBookings: Booking[],
  setPendingBookings: React.Dispatch<React.SetStateAction<Booking[]>>,
  confirmedBookings: Booking[],
  setConfirmedBookings: React.Dispatch<React.SetStateAction<Booking[]>>
) => {
  // Handle booking confirmation
  const handleConfirmBooking = (bookingId: string) => {
    // Find the booking to confirm
    const bookingToConfirm = pendingBookings.find(booking => booking.id === bookingId);
    if (!bookingToConfirm) return;
    
    // Create a confirmed booking from the pending booking
    const confirmedBooking: Booking = {
      ...bookingToConfirm,
      status: "confirmed",
      startTime: bookingToConfirm.time,
      endTime: bookingToConfirm.time ? 
        `${parseInt(bookingToConfirm.time.split(':')[0]) + 2}:${bookingToConfirm.time.split(':')[1]}` : 
        "12:00", // Default 2 hours later
      staff: ["James Carter", "Michael Scott"] // Default staff assignment
    };
    
    // Ensure the date is a proper Date object
    if (typeof confirmedBooking.date === 'string') {
      confirmedBooking.date = new Date(confirmedBooking.date);
    }
    
    // Update the confirmed bookings
    const updatedConfirmedBookings = [...confirmedBookings, confirmedBooking];
    setConfirmedBookings(updatedConfirmedBookings);
    
    // Update the pending bookings list
    const updatedPendingBookings = pendingBookings.filter(booking => booking.id !== bookingId);
    setPendingBookings(updatedPendingBookings);
    
    // Update localStorage by storing the updated pending bookings
    localStorage.setItem('pendingBookings', JSON.stringify(updatedPendingBookings));
    
    // Store confirmed bookings separately in localStorage
    localStorage.setItem('confirmedBookings', JSON.stringify(updatedConfirmedBookings));
    
    // Also store in plannerCalendarBookings for consistency
    const existingPlannerData = localStorage.getItem('plannerCalendarBookings') || '[]';
    try {
      const plannerBookings = JSON.parse(existingPlannerData);
      plannerBookings.push(confirmedBooking);
      localStorage.setItem('plannerCalendarBookings', JSON.stringify(plannerBookings));
    } catch (e) {
      console.error('Error updating planner calendar:', e);
      localStorage.setItem('plannerCalendarBookings', JSON.stringify([confirmedBooking]));
    }
    
    // Generate invoice for the confirmed booking
    generateInvoice(confirmedBooking);
    
    // Show success message
    toast.success(`Booking ${bookingId} confirmed successfully!`, {
      description: "The booking has been added to your schedule."
    });
  };
  
  const handleCancelBooking = (bookingId: string) => {
    // Update the bookings state by removing the cancelled booking
    const updatedBookings = pendingBookings.filter(booking => booking.id !== bookingId);
    setPendingBookings(updatedBookings);
    
    // Update localStorage
    localStorage.setItem('pendingBookings', JSON.stringify(updatedBookings));
    
    // Show success message
    toast.success(`Booking ${bookingId} cancelled successfully!`);
  };
  
  // Get background color based on vehicle condition
  const getBookingBackground = (booking: Booking) => {
    if (booking.status === "pending") return "bg-amber-900/30 border-amber-700";
    if (booking.condition !== undefined && booking.condition < 5) return "bg-orange-800 border-orange-700";
    return "bg-gray-800 border-gray-700";
  };

  return {
    handleConfirmBooking,
    handleCancelBooking,
    getBookingBackground
  };
};
