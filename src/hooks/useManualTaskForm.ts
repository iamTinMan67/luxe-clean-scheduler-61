
import { useManualTaskFormState } from './useManualTaskFormState';
import { useManualTaskOperations } from './useManualTaskOperations';
import { useManualTaskCalculations } from './useManualTaskCalculations';
import { useManualTaskSubmission } from './useManualTaskSubmission';

export const useManualTaskForm = () => {
  const {
    bookingDate,
    setBookingDate,
    timeSlot,
    setTimeSlot,
    tasks,
    setTasks,
    travel,
    setTravel,
    other,
    setOther,
    isSubmitting,
    setIsSubmitting,
    customerData,
    resetForm
  } = useManualTaskFormState();

  const {
    addTask,
    updateTask,
    deleteTask,
    moveTaskUp,
    moveTaskDown
  } = useManualTaskOperations(tasks, setTasks);

  const { subtotal, total } = useManualTaskCalculations(tasks, travel, other);

  const { handleSubmit: submitForm } = useManualTaskSubmission();

  const handleSubmit = (e: React.FormEvent) => {
    submitForm(e, {
      bookingDate,
      timeSlot,
      tasks,
      total,
      customerData,
      setIsSubmitting,
      resetForm
    });
  };

  return {
    bookingDate,
    setBookingDate,
    timeSlot,
    setTimeSlot,
    tasks,
    addTask,
    updateTask,
    deleteTask,
    moveTaskUp,
    moveTaskDown,
    subtotal,
    travel,
    setTravel,
    other,
    setOther,
    total,
    handleSubmit,
    isSubmitting,
    customerData
  };
};
