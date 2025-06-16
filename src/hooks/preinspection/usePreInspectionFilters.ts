
import { useState } from 'react';

export const usePreInspectionFilters = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  return {
    selectedDate,
    setSelectedDate
  };
};
