
import { Booking } from '@/types/booking';
import { isSameDayDate, getDaysForView } from '@/utils/dateUtils';
import { PlannerViewType } from '../usePlannerCalendar';

export const useScheduleFiltering = (
  date: Date, 
  view: PlannerViewType,
  confirmedBookings: Booking[],
  pendingBookings: Booking[]
) => {
  // Filter events for the selected date - include both confirmed and pending
  const filteredBookings = [...confirmedBookings, ...pendingBookings].filter(booking => {
    // Ensure booking.date is a Date object before comparing
    const bookingDate = booking.date instanceof Date ? booking.date : new Date(booking.date);
    return isSameDayDate(bookingDate, date);
  });
  
  // Get schedule for the selected view - include both confirmed and pending
  const getSchedule = () => {
    const daysToShow = getDaysForView(date, view);
    
    return daysToShow.map(day => {
      const dayBookings = [...confirmedBookings, ...pendingBookings].filter(booking => {
        // Ensure booking.date is a Date object before comparing
        const bookingDate = booking.date instanceof Date ? booking.date : new Date(booking.date);
        return isSameDayDate(bookingDate, day);
      }).sort((a, b) => {
        // Sort by time
        const timeA = a.startTime || a.time || '00:00';
        const timeB = b.startTime || b.time || '00:00';
        return timeA.localeCompare(timeB);
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
