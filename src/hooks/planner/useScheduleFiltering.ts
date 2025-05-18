
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
      // For each day in the view, find all confirmed bookings that match that day
      const dayBookings = confirmedBookings.filter(booking => {
        // Ensure booking.date is a Date object before comparing
        const bookingDate = booking.date instanceof Date ? booking.date : new Date(booking.date);
        return isSameDayDate(bookingDate, day);
      });
      
      // Sort bookings by time for the daily view
      const sortedBookings = view === 'daily' 
        ? dayBookings.sort((a, b) => {
            const timeA = a.startTime || a.time || '00:00';
            const timeB = b.startTime || b.time || '00:00';
            return timeA.localeCompare(timeB);
          })
        : dayBookings;
      
      return {
        date: day,
        bookings: sortedBookings
      };
    });
  };
  
  return {
    filteredBookings,
    schedule: getSchedule()
  };
};
