
import { useBookingState } from './bookings/useBookingState';
import { useBookingFilters } from './bookings/useBookingFilters';
import { useBookingActions } from './bookings/useBookingActions';
import { useBookingUpdates } from './bookings/useBookingUpdates';

export const useBookings = () => {
  const {
    pendingBookings,
    setPendingBookings,
    confirmedBookings,
    setConfirmedBookings,
    date,
    setDate,
    view,
    setView
  } = useBookingState();

  const { getBookingsForDate } = useBookingFilters(date, confirmedBookings, pendingBookings);

  const {
    handleConfirmBooking,
    handleDeleteBooking,
    handleCompleteBooking
  } = useBookingActions(pendingBookings, setPendingBookings, confirmedBookings, setConfirmedBookings);

  const {
    handlePackageChange,
    handleReschedule
  } = useBookingUpdates(pendingBookings, setPendingBookings, confirmedBookings, setConfirmedBookings);

  return {
    pendingBookings,
    confirmedBookings,
    date,
    setDate,
    view,
    setView,
    getBookingsForDate,
    handleConfirmBooking,
    handleDeleteBooking,
    handlePackageChange,
    handleReschedule,
    handleCompleteBooking
  };
};
