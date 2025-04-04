
import { Booking } from '@/types/booking';
import { isSameDayDate, getDaysForView } from '@/utils/dateUtils';

export const useScheduleFiltering = (
  date: Date, 
  view: "daily" | "weekly",
  confirmedBookings: Booking[],
  pendingBookings: Booking[]
) => {
  // Filter events for the selected date - include both confirmed and pending
  const filteredBookings = [...confirmedBookings, ...pendingBookings].filter(booking => {
    return isSameDayDate(booking.date, date);
  });
  
  // Get schedule for the selected view - include both confirmed and pending
  const getSchedule = () => {
    const daysToShow = getDaysForView(date, view);
    
    return daysToShow.map(day => {
      const dayBookings = [...confirmedBookings, ...pendingBookings].filter(booking => {
        return isSameDayDate(booking.date, day);
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
