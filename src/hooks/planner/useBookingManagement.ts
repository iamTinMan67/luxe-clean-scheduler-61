import { Booking } from '@/types/booking';
import { toast } from 'sonner';
import { generateInvoice } from '@/utils/bookingUtils';
import { syncBookingToSupabase, deleteBookingFromSupabase } from '@/services/bookingSyncService';
import { generateBookingId } from '@/utils/bookingIdGenerator';

export const useBookingManagement = (
  pendingBookings: Booking[],
  setPendingBookings: React.Dispatch<React.SetStateAction<Booking[]>>,
  confirmedBookings: Booking[],
  setConfirmedBookings: React.Dispatch<React.SetStateAction<Booking[]>>
) => {
  // Function to confirm a booking
  const handleConfirmBooking = async (bookingId: string, selectedStaff: string[] = ['Karl', 'Salleah'], travelMinutes: number = 15) => {
    // Find the booking to confirm
    const bookingToConfirm = pendingBookings.find(booking => booking.id === bookingId);
    
    if (!bookingToConfirm) {
      toast.error("Booking not found");
      return;
    }
    
    // Create a confirmed booking with staff assignment
    const confirmedBooking: Booking = {
      ...bookingToConfirm,
      status: "confirmed",
      staff: selectedStaff,
      travelMinutes
    };
    
    // Update localStorage first
    const updatedPendingBookings = pendingBookings.filter(booking => booking.id !== bookingId);
    setPendingBookings(updatedPendingBookings);
    
    const updatedConfirmedBookings = [...confirmedBookings, confirmedBooking];
    setConfirmedBookings(updatedConfirmedBookings);
    
    // Save to localStorage
    localStorage.setItem('pendingBookings', JSON.stringify(updatedPendingBookings));
    localStorage.setItem('confirmedBookings', JSON.stringify(updatedConfirmedBookings));
    
    // Update planner calendar bookings as well
    const existingPlannerBookings = localStorage.getItem('plannerCalendarBookings') 
      ? JSON.parse(localStorage.getItem('plannerCalendarBookings') || '[]') 
      : [];
    
    localStorage.setItem('plannerCalendarBookings', JSON.stringify([
      ...existingPlannerBookings,
      confirmedBooking
    ]));
    
    // Sync to Supabase
    try {
      const syncSuccess = await syncBookingToSupabase(confirmedBooking);
      if (syncSuccess) {
        console.log('Booking successfully synced to database');
      } else {
        console.warn('Failed to sync booking to database, but localStorage updated');
        toast.warning('Booking confirmed locally but may not appear in all views until page refresh');
      }
    } catch (error) {
      console.error('Error syncing to database:', error);
      toast.warning('Booking confirmed locally but database sync failed');
    }
    
    // Create invoice (this will now use the new booking ID)
    generateInvoice(confirmedBooking);
    
    toast.success(`${confirmedBooking.packageType} Package confirmed successfully for ${confirmedBooking.customer} (ID: ${confirmedBooking.id})`);
  };
  
  // Function to cancel a booking
  const handleCancelBooking = async (bookingId: string) => {
    // Update the booking status to cancelled
    const bookingToCancel = pendingBookings.find(booking => booking.id === bookingId);
    
    if (!bookingToCancel) {
      toast.error("Booking not found");
      return;
    }
    
    // Create a cancelled booking
    const cancelledBooking: Booking = {
      ...bookingToCancel,
      status: "cancelled"
    };
    
    // Update localStorage
    const updatedPendingBookings = pendingBookings.filter(booking => booking.id !== bookingId);
    setPendingBookings(updatedPendingBookings);
    
    localStorage.setItem('pendingBookings', JSON.stringify(updatedPendingBookings));
    
    // Store cancelled bookings separately if needed
    const cancelledBookings = localStorage.getItem('cancelledBookings') 
      ? JSON.parse(localStorage.getItem('cancelledBookings') || '[]') 
      : [];
    
    localStorage.setItem('cancelledBookings', JSON.stringify([
      ...cancelledBookings,
      cancelledBooking
    ]));
    
    // Try to delete from Supabase if it exists there
    try {
      await deleteBookingFromSupabase(bookingId);
      console.log('Booking deleted from database');
    } catch (error) {
      console.warn('Failed to delete from database:', error);
    }
    
    toast.success(`${cancelledBooking.packageType} Package cancelled for ${cancelledBooking.customer} (ID: ${cancelledBooking.id})`);
  };
  
  // Function to get background color based on booking status
  const getBookingBackground = (booking: Booking) => {
    switch (booking.status) {
      case "pending":
        return "border-amber-500 bg-amber-950/30";
      case "confirmed":
        return "border-green-500 bg-green-950/30";
      case "in-progress":
        return "border-blue-500 bg-blue-950/30";
      case "finished":
        return "border-purple-500 bg-purple-950/30";
      case "cancelled":
        return "border-red-500 bg-red-950/30";
      default:
        return "border-gray-500 bg-gray-950/30";
    }
  };
  
  return {
    handleConfirmBooking,
    handleCancelBooking,
    getBookingBackground
  };
};
