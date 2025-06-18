
import { useMemo } from 'react';
import { TaskItem } from './useManualTaskFormState';

export const useManualTaskCalculations = (
  tasks: TaskItem[],
  travel: number,
  other: number
) => {
  // Calculate subtotal from tasks
  const subtotal = useMemo(() => {
    return tasks.reduce((sum, task) => sum + task.cost, 0);
  }, [tasks]);

  // Calculate total
  const total = useMemo(() => {
    return subtotal + travel + other;
  }, [subtotal, travel, other]);

  return {
    subtotal,
    total
  };
};
