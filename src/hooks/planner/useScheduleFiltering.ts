
import { Booking } from '@/types/booking';
import { isSameDayDate, getDaysForView } from '@/utils/dateUtils';
import { PlannerViewType } from '../usePlannerCalendar';

export const useScheduleFiltering = (
  date: Date, 
  view: PlannerViewType,
  confirmedBookings: Booking[],
  pendingBookings: Booking[]
) => {
  // Filter events for the selected date - only include confirmed bookings, not pending
  const filteredBookings = confirmedBookings.filter(booking => {
    // Ensure booking.date is a Date object before comparing
    const bookingDate = booking.date instanceof Date ? booking.date : new Date(booking.date);
    return isSameDayDate(bookingDate, date);
  });
  
  // Get schedule for the selected view - only include confirmed bookings
  const getSchedule = () => {
    const daysToShow = getDaysForView(date, view);
    
    return daysToShow.map(day => {
      const dayBookings = confirmedBookings.filter(booking => {
        // Ensure booking.date is a Date object before comparing
        const bookingDate = booking.date instanceof Date ? booking.date : new Date(booking.date);
        return isSameDayDate(bookingDate, day);
      });
      
      return {
        date: day,
        bookings: dayBookings
      };
    });
  };
  
  return {
    filteredBookings,
    schedule: getSchedule()
  };
};
