
import { useBookingsStorage } from './useBookingsStorage';
import { useBookingMutations } from './useBookingMutations';
import { useCalendarState } from './useCalendarState';

/**
 * Main hook that composes smaller hooks for complete booking state management
 */
export const useBookingStateManager = () => {
  // Get storage-related state and functions
  const {
    pendingBookings,
    setPendingBookings,
    confirmedBookings,
    setConfirmedBookings,
    saveBookingsToStorage,
    loadBookingsFromStorage
  } = useBookingsStorage();

  // Get calendar-related state
  const {
    date,
    setDate,
    view,
    setView
  } = useCalendarState();

  // Get booking mutation functions
  const {
    updateBooking,
    moveBookingToConfirmed,
    deleteBooking
  } = useBookingMutations();

  return {
    pendingBookings,
    setPendingBookings,
    confirmedBookings,
    setConfirmedBookings,
    date,
    setDate,
    view,
    setView,
    updateBooking,
    moveBookingToConfirmed,
    deleteBooking,
    saveBookingsToStorage,
    loadBookingsFromStorage
  };
};
