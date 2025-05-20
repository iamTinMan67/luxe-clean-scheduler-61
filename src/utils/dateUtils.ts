
import { addDays, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay } from "date-fns";
import { PlannerViewType } from "@/hooks/usePlannerCalendar";

// Navigate to previous day or week
export const navigatePrevious = (date: Date, view: PlannerViewType) => {
  if (view === "daily") return addDays(date, -1);
  if (view === "weekly") return addDays(date, -7);
  return date; // Should never reach here with current view types
};

// Navigate to next day or week
export const navigateNext = (date: Date, view: PlannerViewType) => {
  if (view === "daily") return addDays(date, 1);
  if (view === "weekly") return addDays(date, 7);
  return date; // Should never reach here with current view types
};

// Get days to show based on the selected view
export const getDaysForView = (date: Date, view: PlannerViewType) => {
  if (view === "daily") {
    return [date];
  } else if (view === "weekly") {
    // Weekly view
    const start = startOfWeek(date, { weekStartsOn: 1 }); // Start on Monday
    const end = endOfWeek(date, { weekStartsOn: 1 });
    return eachDayOfInterval({ start, end });
  }
  return [date]; // Should never reach here with current view types
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

// Helper to add minutes to a time string (HH:MM format)
export const addMinutesToTime = (time: string, minutes: number): string => {
  const [hoursStr, minutesStr] = time.split(':');
  let hours = parseInt(hoursStr);
  let mins = parseInt(minutesStr) + minutes;
  
  // Handle minute overflow
  if (mins >= 60) {
    hours += Math.floor(mins / 60);
    mins = mins % 60;
  }
  
  // Handle hour overflow
  if (hours >= 24) {
    hours = hours % 24;
  }
  
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
};

// Helper to add hours to a time string (HH:MM format)
export const addHoursToTime = (time: string, hours: number): string => {
  return addMinutesToTime(time, hours * 60);
};

// Check for booking time conflicts including travel time
export const hasTimeConflict = (date: Date, time: string, bookings: any[]) => {
  return bookings.some(booking => {
    // Only check confirmed bookings
    if (booking.status !== "confirmed") return false;
    
    const bookingDate = booking.date instanceof Date ? booking.date : new Date(booking.date);
    
    // First check if it's the same day
    if (!isSameDay(bookingDate, date)) return false;
    
    // Get booking start and end times, accounting for travel time
    const bookingStartTime = booking.startTime || booking.time;
    const travelMinutesBefore = booking.travelMinutes || 0;
    
    // Adjust booking start time to include travel time before
    const actualBookingStartTime = travelMinutesBefore > 0 
      ? addMinutesToTime(bookingStartTime, -travelMinutesBefore) 
      : bookingStartTime;
    
    // Calculate the end time including service duration and travel time after
    const bookingEndTime = booking.endTime || addHoursToTime(bookingStartTime, 2); // Default 2 hours if no end time
    const travelMinutesAfter = booking.travelMinutes || 0;
    
    // Adjust booking end time to include travel time after
    const actualBookingEndTime = travelMinutesAfter > 0 
      ? addMinutesToTime(bookingEndTime, travelMinutesAfter) 
      : bookingEndTime;
    
    // Calculate end time for new booking (assume 2 hours if not specified)
    const newEndTime = addHoursToTime(time, 2);
    
    // Check for overlap
    return (time < actualBookingEndTime && newEndTime > actualBookingStartTime);
  });
};
