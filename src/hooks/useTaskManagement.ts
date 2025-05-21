
import { useToast } from "@/hooks/use-toast";
import { useTodoItems } from "./useTodoItems";
import { useBookingSelection } from "./useBookingSelection";
import { useServiceTasks } from "./useServiceTasks";

export const useTaskManagement = () => {
  const { toast } = useToast();
  
  // Use the specialized hook for todo list functionality
  const {
    todos,
    newTodo,
    setNewTodo,
    handleAddTodo,
    handleCompleteTodo,
    handleDeleteTodo
  } = useTodoItems();
  
  // Use the specialized hook for booking selection
  const {
    selectedAppointment,
    setSelectedAppointment,
    currentBooking,
    appointments,
    loading
  } = useBookingSelection();
  
  // Use the specialized hook for service tasks management
  const {
    serviceTasks,
    handleUpdateTimeAllocation,
    handleToggleTaskCompletion,
    handleSetActualTime,
    handleSaveServiceProgress
  } = useServiceTasks(selectedAppointment, currentBooking);
  
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
    handleSaveServiceProgress
  };
};

export type { TodoTask } from './useTodoItems';
