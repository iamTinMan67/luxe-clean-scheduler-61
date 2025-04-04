
import { addDays, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay } from "date-fns";

// Navigate to previous day or week
export const navigatePrevious = (date: Date, view: "daily" | "weekly") => {
  return view === "daily" ? addDays(date, -1) : addDays(date, -7);
};

// Navigate to next day or week
export const navigateNext = (date: Date, view: "daily" | "weekly") => {
  return view === "daily" ? addDays(date, 1) : addDays(date, 7);
};

// Get days to show based on the selected view
export const getDaysForView = (date: Date, view: "daily" | "weekly") => {
  if (view === "daily") {
    return [date];
  } else {
    // Weekly view
    const start = startOfWeek(date, { weekStartsOn: 1 }); // Start on Monday
    const end = endOfWeek(date, { weekStartsOn: 1 });
    return eachDayOfInterval({ start, end });
  }
};

// Check if two dates are the same day
export const isSameDayDate = (date1: Date | string, date2: Date) => {
  const date1AsDate = date1 instanceof Date ? date1 : new Date(date1);
  return isSameDay(date1AsDate, date2);
};
