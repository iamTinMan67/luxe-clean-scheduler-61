
import { useBookingsStorage } from './useBookingsStorage';
import { useBookingMutations } from './useBookingMutations';
import { useCalendarState } from './useCalendarState';

/**
 * Main hook that composes smaller hooks for complete booking state management
 */
export const useBookingStateManager = () => {
  // Get storage-related state and functions
  const storageProps = useBookingsStorage();
  
  // Get calendar-related state
  const calendarProps = useCalendarState();
  
  // Get booking mutation functions
  const mutationProps = useBookingMutations();

  // Return a consolidated interface with all booking-related functionality
  return {
    ...storageProps,
    ...calendarProps,
    ...mutationProps
  };
};
