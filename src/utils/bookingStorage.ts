
import { Booking } from "@/types/booking";

export const saveBookingToStorage = (booking: Booking): void => {
  // Save to localStorage (existing booking storage)
  const existingBookings = JSON.parse(localStorage.getItem('bookings') || '[]');
  const updatedBookings = [...existingBookings, booking];
  localStorage.setItem('bookings', JSON.stringify(updatedBookings));

  console.log("Booking saved to localStorage. Total bookings:", updatedBookings.length);
};

export const clearClientTypeFromStorage = (): void => {
  // Clear the saved client type
  localStorage.removeItem('selectedClientType');
};
