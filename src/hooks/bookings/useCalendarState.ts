
import { useState } from 'react';

/**
 * Hook for managing calendar view state
 */
export const useCalendarState = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [view, setView] = useState<'daily' | 'weekly' | 'monthly'>('daily');

  return {
    date,
    setDate,
    view,
    setView
  };
};
