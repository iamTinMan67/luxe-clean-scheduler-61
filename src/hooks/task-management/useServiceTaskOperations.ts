
import { ServiceTaskItem } from "@/types/task";
import { Booking } from "@/types/booking";

export const useServiceTaskOperations = (
  serviceTasks: ServiceTaskItem[],
  setServiceTasks: React.Dispatch<React.SetStateAction<ServiceTaskItem[]>>,
  currentBooking: Booking | null
) => {
  // Handle updating time allocation
  const handleUpdateTimeAllocation = (taskId: string, newTime: number) => {
    setServiceTasks(
      serviceTasks.map(task => 
        task.id === taskId ? { ...task, allocatedTime: newTime } : task
      )
    );
  };

  // Handle toggling task completion
  const handleToggleTaskCompletion = (taskId: string) => {
    setServiceTasks(
      serviceTasks.map(task => 
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  // Handle setting actual time spent
  const handleSetActualTime = (taskId: string, time: number) => {
    setServiceTasks(
      serviceTasks.map(task => 
        task.id === taskId ? { ...task, actualTime: time } : task
      )
    );
  };

  // Calculate total time for current booking tasks
  const calculateTotalBookingTime = () => {
    if (!serviceTasks.length) return 0;
    
    return serviceTasks.reduce((total, task) => total + task.allocatedTime, 0);
  };
  
  // Calculate remaining time based on completed tasks
  const calculateRemainingTime = () => {
    const totalTime = calculateTotalBookingTime();
    const completedTime = serviceTasks
      .filter(task => task.completed)
      .reduce((total, task) => total + task.allocatedTime, 0);
      
    return totalTime - completedTime;
  };

  return {
    handleUpdateTimeAllocation,
    handleToggleTaskCompletion,
    handleSetActualTime,
    calculateTotalBookingTime,
    calculateRemainingTime
  };
};
