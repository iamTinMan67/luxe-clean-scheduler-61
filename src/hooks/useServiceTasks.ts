
import { useState, useEffect } from 'react';
import { Booking } from "@/types/booking";
import { ServiceTaskItem } from "@/types/task";
import { packageOptions, additionalServices } from "@/data/servicePackageData";
import { generateServiceTasksFromPackage, loadServiceTasksProgress } from "@/utils/taskUtils";
import { useServiceProgress } from './useServiceProgress';
import { supabase } from "@/integrations/supabase/client";

export const useServiceTasks = (selectedBookingId: string, currentBooking: Booking | null) => {
  const [serviceTasks, setServiceTasks] = useState<ServiceTaskItem[]>([]);
  const { saveServiceProgress, saveProgressWithNotification } = useServiceProgress();
  
  // Generate service tasks when booking changes
  useEffect(() => {
    const loadTasks = async () => {
      if (currentBooking) {
        // Generate tasks from package
        const generatedTasks = generateServiceTasksFromPackage(currentBooking, packageOptions, additionalServices);
        
        // Fetch additional services from database for this booking
        try {
          const { data: bookingAdditionalServices, error } = await supabase
            .from('booking_additional_services')
            .select('*')
            .eq('booking_id', currentBooking.id);
          
          if (!error && bookingAdditionalServices) {
            // Add additional services to the task list
            const additionalServiceTasks = bookingAdditionalServices.map(service => ({
              id: `additional-${service.id}-${Date.now()}`,
              name: service.service_name,
              completed: false,
              allocatedTime: 30 // Default to 30 minutes for additional services
            }));
            
            generatedTasks.push(...additionalServiceTasks);
          }
        } catch (error) {
          console.error('Error fetching additional services:', error);
        }
        
        const tasksWithProgress = loadServiceTasksProgress(generatedTasks, currentBooking.id);
        setServiceTasks(tasksWithProgress);
      } else {
        setServiceTasks([]);
      }
    };

    loadTasks();
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
