
import { useState } from 'react';

/**
 * Hook for managing calendar view state
 */
export const useCalendarState = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [view, setView] = useState<'daily' | 'weekly' | 'monthly'>('daily');

  // Helper function to navigate to today
  const goToToday = () => setDate(new Date());

  // Helper function to check if a date is today
  const isToday = (checkDate?: Date): boolean => {
    if (!checkDate) return false;
    const today = new Date();
    return (
      checkDate.getDate() === today.getDate() &&
      checkDate.getMonth() === today.getMonth() &&
      checkDate.getFullYear() === today.getFullYear()
    );
  };

  return {
    date,
    setDate,
    view,
    setView,
    goToToday,
    isToday
  };
};
