
import { useBookingStateManager } from './bookings/useBookingStateManager';
import { useBookingManagement } from './bookings/useBookingManagement';
import { useBookingOperations } from './bookings/useBookingOperations';
import { PlannerViewType } from './usePlannerCalendar';
import { useBookingManagement as usePlannerBookingManagement } from './planner/useBookingManagement';

export const useBookings = () => {
  const {
    date,
    setDate,
    view,
    setView,
    pendingBookings,
    confirmedBookings
  } = useBookingStateManager();
  
  const { 
    handleConfirmBooking,
    handleCompleteBooking,
    handleUpdateStatus
  } = useBookingManagement();
  
  const {
    getBookingsForDate,
    handleDeleteBooking,
    handlePackageChange,
    handleReschedule
  } = useBookingOperations();
  
  const { getBookingBackground } = usePlannerBookingManagement(
    pendingBookings,
    () => {}, // We're not using setPendingBookings directly anymore
    confirmedBookings,
    () => {}  // We're not using setConfirmedBookings directly anymore
  );
  
  return {
    pendingBookings,
    confirmedBookings,
    date,
    setDate,
    view: view as PlannerViewType,
    setView: setView as (view: PlannerViewType) => void,
    getBookingsForDate,
    handleConfirmBooking,
    handleDeleteBooking,
    handlePackageChange,
    handleReschedule,
    handleCompleteBooking,
    handleUpdateStatus,
    getBookingBackground
  };
};
