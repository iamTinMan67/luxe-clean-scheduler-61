
import { addDays, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, startOfMonth, endOfMonth } from "date-fns";

// Navigate to previous day, week or month
export const navigatePrevious = (date: Date, view: "daily" | "weekly" | "monthly") => {
  if (view === "daily") return addDays(date, -1);
  if (view === "weekly") return addDays(date, -7);
  // For monthly view, go back to same date in previous month
  const prevMonth = new Date(date);
  prevMonth.setMonth(prevMonth.getMonth() - 1);
  return prevMonth;
};

// Navigate to next day, week or month
export const navigateNext = (date: Date, view: "daily" | "weekly" | "monthly") => {
  if (view === "daily") return addDays(date, 1);
  if (view === "weekly") return addDays(date, 7);
  // For monthly view, go forward to same date in next month
  const nextMonth = new Date(date);
  nextMonth.setMonth(nextMonth.getMonth() + 1);
  return nextMonth;
};

// Get days to show based on the selected view
export const getDaysForView = (date: Date, view: "daily" | "weekly" | "monthly") => {
  if (view === "daily") {
    return [date];
  } else if (view === "weekly") {
    // Weekly view
    const start = startOfWeek(date, { weekStartsOn: 1 }); // Start on Monday
    const end = endOfWeek(date, { weekStartsOn: 1 });
    return eachDayOfInterval({ start, end });
  } else {
    // Monthly view
    const start = startOfMonth(date);
    const end = endOfMonth(date);
    return eachDayOfInterval({ start, end });
  }
};

// Check if two dates are the same day
export const isSameDayDate = (date1: Date | string, date2: Date) => {
  const date1AsDate = date1 instanceof Date ? date1 : new Date(date1);
  return isSameDay(date1AsDate, date2);
};

// Check if a date has any bookings
export const hasBookingsOnDate = (date: Date, bookings: any[]) => {
  return bookings.some(booking => {
    const bookingDate = booking.date instanceof Date ? booking.date : new Date(booking.date);
    return isSameDay(bookingDate, date);
  });
};

// Check for booking time conflicts
export const hasTimeConflict = (date: Date, time: string, bookings: any[]) => {
  return bookings.some(booking => {
    // Only check confirmed bookings
    if (booking.status !== "confirmed") return false;
    
    const bookingDate = booking.date instanceof Date ? booking.date : new Date(booking.date);
    
    // First check if it's the same day
    if (!isSameDay(bookingDate, date)) return false;
    
    // Check if times overlap
    const bookingStartTime = booking.startTime || booking.time;
    const bookingEndTime = booking.endTime || addHoursToTime(bookingStartTime, 2); // Default 2 hours if no end time
    
    // Calculate end time for new booking (assume 2 hours if not specified)
    const newEndTime = addHoursToTime(time, 2);
    
    // Check for overlap
    return (time < bookingEndTime && newEndTime > bookingStartTime);
  });
};

// Helper to add hours to a time string (HH:MM format)
const addHoursToTime = (time: string, hours: number): string => {
  const [hoursStr, minutes] = time.split(':');
  let totalHours = parseInt(hoursStr) + hours;
  
  if (totalHours >= 24) {
    totalHours = totalHours % 24;
  }
  
  return `${totalHours.toString().padStart(2, '0')}:${minutes}`;
};
