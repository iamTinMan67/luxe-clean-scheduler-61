
import { useScheduledAppointments } from "@/hooks/useScheduledAppointments";
import { useTaskState } from './task-management/useTaskState';
import { useTodoOperations } from './task-management/useTodoOperations';
import { useServiceTaskOperations } from './task-management/useServiceTaskOperations';
import { useProgressTracking } from './task-management/useProgressTracking';
import { useAppointmentSelection } from './task-management/useAppointmentSelection';

export const useTaskManagement = () => {
  const { appointments, loading } = useScheduledAppointments();
  
  const {
    todos, 
    setTodos,
    newTodo, 
    setNewTodo,
    bookingIdFromUrl,
    selectedAppointment, 
    setSelectedAppointment,
    currentBooking, 
    setCurrentBooking,
    serviceTasks, 
    setServiceTasks,
    taskProgress,
    updateTaskProgress
  } = useTaskState();

  const {
    handleAddTodo,
    handleCompleteTodo,
    handleDeleteTodo
  } = useTodoOperations(todos, setTodos, newTodo, setNewTodo);

  const {
    handleUpdateTimeAllocation,
    handleToggleTaskCompletion,
    handleSetActualTime,
    calculateTotalBookingTime,
    calculateRemainingTime
  } = useServiceTaskOperations(serviceTasks, setServiceTasks, currentBooking);

  const {
    handleSaveServiceProgress
  } = useProgressTracking(currentBooking);

  // Initialize appointment selection and service tasks
  const { isBookingComplete } = useAppointmentSelection(
    selectedAppointment,
    bookingIdFromUrl,
    appointments,
    setSelectedAppointment,
    setCurrentBooking,
    setServiceTasks,
    taskProgress,
    updateTaskProgress
  );

  const handleSaveWithTasks = () => {
    handleSaveServiceProgress(serviceTasks);
  };

  return {
    todos,
    newTodo,
    setNewTodo,
    selectedAppointment,
    setSelectedAppointment,
    currentBooking,
    serviceTasks,
    loading,
    appointments,
    handleAddTodo,
    handleCompleteTodo,
    handleDeleteTodo,
    handleUpdateTimeAllocation,
    handleToggleTaskCompletion,
    handleSetActualTime,
    handleSaveServiceProgress: handleSaveWithTasks,
    calculateTotalBookingTime,
    calculateRemainingTime,
    isBookingComplete
  };
};

export interface TodoTask {
  id: number;
  text: string;
  completed: boolean;
}
