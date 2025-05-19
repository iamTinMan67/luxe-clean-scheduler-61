
import React from 'react';
import { Booking } from '@/types/booking';
import { toast } from 'sonner';

export const useBookingManagement = (
  pendingBookings: Booking[],
  setPendingBookings: React.Dispatch<React.SetStateAction<Booking[]>>,
  confirmedBookings: Booking[],
  setConfirmedBookings: React.Dispatch<React.SetStateAction<Booking[]>>
) => {
  // Handle confirming a booking - now accepts an optional enriched booking param
  const handleConfirmBooking = (
    bookingId: string, 
    selectedStaff: string[], 
    travelMinutes: number,
    enrichedBooking?: Booking
  ) => {
    // Find the booking in the pending list
    const bookingToConfirm = pendingBookings.find((booking) => booking.id === bookingId);
    
    if (bookingToConfirm) {
      // Remove the booking from pending
      const updatedPendingBookings = pendingBookings.filter(
        (booking) => booking.id !== bookingId
      );
      setPendingBookings(updatedPendingBookings);
      
      // Use enriched booking if provided, otherwise create a new one
      const confirmedBooking = enrichedBooking || {
        ...bookingToConfirm,
        status: "confirmed" as const,
        staff: selectedStaff,
        travelMinutes
      };
      
      // Make sure status is set to confirmed (enrichedBooking might not have this)
      confirmedBooking.status = "confirmed";
      
      // Add staff if not in the enriched booking
      if (!confirmedBooking.staff) {
        confirmedBooking.staff = selectedStaff;
      }
      
      // Add travel minutes if not in enriched booking
      if (!confirmedBooking.travelMinutes) {
        confirmedBooking.travelMinutes = travelMinutes;
      }
      
      // Add the booking to confirmed
      const updatedConfirmedBookings = [...confirmedBookings, confirmedBooking];
      setConfirmedBookings(updatedConfirmedBookings);
      
      // Save to localStorage
      localStorage.setItem('pendingBookings', JSON.stringify(updatedPendingBookings));
      localStorage.setItem('confirmedBookings', JSON.stringify(updatedConfirmedBookings));
      localStorage.setItem('plannerCalendarBookings', JSON.stringify(updatedConfirmedBookings));
    }
  };

  // Handle cancelling a booking
  const handleCancelBooking = (bookingId: string) => {
    const bookingToDelete = pendingBookings.find((booking) => booking.id === bookingId);
    
    if (bookingToDelete) {
      // Remove the booking from pending
      const updatedPendingBookings = pendingBookings.filter(
        (booking) => booking.id !== bookingId
      );
      setPendingBookings(updatedPendingBookings);
      
      // Save to localStorage
      localStorage.setItem('pendingBookings', JSON.stringify(updatedPendingBookings));
      
      // Show toast notification
      toast.success(`Booking for ${bookingToDelete.customer} has been cancelled.`);
    }
  };

  // Get background color for a booking based on its status
  const getBookingBackground = (booking: Booking) => {
    switch (booking.status) {
      case "pending":
        return "border-yellow-600/50 bg-yellow-900/20";
      case "confirmed":
        return "border-green-600/50 bg-green-900/20";
      case "in-progress":
        return "border-blue-600/50 bg-blue-900/20";
      case "completed":
        return "border-purple-600/50 bg-purple-900/20";
      case "finished":
        return "border-cyan-600/50 bg-cyan-900/20";
      case "cancelled":
        return "border-red-600/50 bg-red-900/20";
      default:
        return "border-gray-700 bg-gray-900/20";
    }
  };

  return {
    handleConfirmBooking,
    handleCancelBooking,
    getBookingBackground
  };
};
