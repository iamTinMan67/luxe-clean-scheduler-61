
import { Booking } from "@/types/booking";

export const saveBookingToStorage = (booking: Booking): void => {
  console.log("=== Starting booking save process ===");
  console.log("Booking to save:", booking);
  
  // Load existing pending bookings from the correct key
  const existingBookings = JSON.parse(localStorage.getItem('pendingBookings') || '[]');
  console.log("Existing pending bookings count:", existingBookings.length);
  
  // Ensure the booking has a proper Date object (not complex Date with _type)
  const normalizedBooking = {
    ...booking,
    date: booking.date instanceof Date ? booking.date : new Date(booking.date)
  };
  
  // Append the new booking to existing ones
  const updatedBookings = [...existingBookings, normalizedBooking];
  
  // Save to the correct localStorage key that pending bookings list reads from
  localStorage.setItem('pendingBookings', JSON.stringify(updatedBookings));
  
  console.log("Booking saved to 'pendingBookings' key. Total bookings:", updatedBookings.length);
  console.log("Updated pendingBookings array:", updatedBookings);
  
  // Also save to the legacy 'bookings' key for backward compatibility
  const legacyBookings = JSON.parse(localStorage.getItem('bookings') || '[]');
  const updatedLegacyBookings = [...legacyBookings, normalizedBooking];
  localStorage.setItem('bookings', JSON.stringify(updatedLegacyBookings));
  
  console.log("Also saved to legacy 'bookings' key for compatibility");
};

export const clearClientTypeFromStorage = (): void => {
  // Clear the saved client type
  localStorage.removeItem('selectedClientType');
  console.log("Cleared selectedClientType from storage");
};
