
import { useState, useEffect } from 'react';
import { Booking } from "@/types/booking";
import { ServiceTaskItem } from "@/types/task";
import { packageOptions, additionalServices } from "@/data/servicePackageData";
import { generateServiceTasksFromPackage, loadServiceTasksProgress } from "@/utils/taskUtils";
import { useServiceProgress } from './useServiceProgress';

export const useServiceTasks = (selectedBookingId: string, currentBooking: Booking | null) => {
  const [serviceTasks, setServiceTasks] = useState<ServiceTaskItem[]>([]);
  const { saveServiceProgress, saveProgressWithNotification } = useServiceProgress();
  
  // Generate service tasks when booking changes
  useEffect(() => {
    if (currentBooking) {
      const generatedTasks = generateServiceTasksFromPackage(currentBooking, packageOptions, additionalServices);
      const tasksWithProgress = loadServiceTasksProgress(generatedTasks, currentBooking.id);
      setServiceTasks(tasksWithProgress);
    } else {
      setServiceTasks([]);
    }
  }, [currentBooking]);

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
    
    // Auto-save progress after each change
    if (currentBooking) {
      saveServiceProgress(currentBooking.id, serviceTasks);
    }
  };

  // Handle setting actual time spent
  const handleSetActualTime = (taskId: string, time: number) => {
    setServiceTasks(
      serviceTasks.map(task => 
        task.id === taskId ? { ...task, actualTime: time } : task
      )
    );
    
    // Auto-save progress after each change
    if (currentBooking) {
      saveServiceProgress(currentBooking.id, serviceTasks);
    }
  };

  // Handle saving service progress with notification
  const handleSaveServiceProgress = () => {
    if (currentBooking) {
      saveProgressWithNotification(currentBooking.id, serviceTasks);
    }
  };

  return {
    serviceTasks,
    handleUpdateTimeAllocation,
    handleToggleTaskCompletion,
    handleSetActualTime,
    handleSaveServiceProgress
  };
};
