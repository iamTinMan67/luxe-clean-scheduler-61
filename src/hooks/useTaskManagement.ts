
import { useBookingSelection } from "./useBookingSelection";
import { useServiceTasks } from "./useServiceTasks";

export const useTaskManagement = () => {
  // Use the specialized hook for booking selection with enhanced features
  const {
    selectedAppointment,
    setSelectedAppointment,
    currentBooking,
    appointments,
    loading,
    selectedDate,
    setSelectedDate,
    searchTerm,
    setSearchTerm
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
    selectedAppointment,
    setSelectedAppointment,
    currentBooking,
    serviceTasks,
    loading,
    appointments,
    selectedDate,
    setSelectedDate,
    searchTerm,
    setSearchTerm,
    handleUpdateTimeAllocation,
    handleToggleTaskCompletion,
    handleSetActualTime,
    handleSaveServiceProgress
  };
};
