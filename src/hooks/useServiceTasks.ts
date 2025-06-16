
import { useState, useEffect, useCallback } from 'react';
import { Booking } from "@/types/booking";
import { ServiceTaskItem } from "@/types/task";
import { packageOptions, additionalServices } from "@/data/servicePackageData";
import { generateServiceTasksFromPackage, loadServiceTasksProgress } from "@/utils/taskUtils";
import { useServiceProgress } from './useServiceProgress';
import { supabase } from "@/integrations/supabase/client";

export const useServiceTasks = (selectedBookingId: string, currentBooking: Booking | null) => {
  const [serviceTasks, setServiceTasks] = useState<ServiceTaskItem[]>([]);
  const { saveServiceProgress } = useServiceProgress();
  
  // Generate service tasks when booking changes
  useEffect(() => {
    const loadTasks = async () => {
      if (currentBooking) {
        console.log("Loading tasks for booking:", currentBooking.id);
        
        // Generate tasks from package with more stable IDs
        const generatedTasks = generateServiceTasksFromPackage(currentBooking, packageOptions, additionalServices);
        
        // Fetch additional services from database for this booking
        try {
          const { data: bookingAdditionalServices, error } = await supabase
            .from('booking_additional_services')
            .select('*')
            .eq('booking_id', currentBooking.id);
          
          if (!error && bookingAdditionalServices) {
            // Add additional services to the task list with stable IDs
            const additionalServiceTasks = bookingAdditionalServices.map((service, index) => ({
              id: `additional-${service.service_name.toLowerCase().replace(/\s+/g, '-')}-${index}`,
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
        console.log("Loaded tasks:", tasksWithProgress);
        setServiceTasks(tasksWithProgress);
      } else {
        setServiceTasks([]);
      }
    };

    loadTasks();
  }, [currentBooking?.id]); // Only depend on booking ID to avoid unnecessary reloads

  // Debounced save function to prevent too frequent saves
  const debouncedSave = useCallback((bookingId: string, tasks: ServiceTaskItem[]) => {
    const timeoutId = setTimeout(() => {
      saveServiceProgress(bookingId, tasks);
      console.log('Auto-saved service progress');
    }, 1000); // Increased debounce time

    return () => clearTimeout(timeoutId);
  }, [saveServiceProgress]);

  // Auto-save whenever serviceTasks change, but debounced
  useEffect(() => {
    if (currentBooking && serviceTasks.length > 0) {
      const cleanup = debouncedSave(currentBooking.id, serviceTasks);
      return cleanup;
    }
  }, [serviceTasks, currentBooking?.id, debouncedSave]);

  // Handle updating time allocation
  const handleUpdateTimeAllocation = useCallback((taskId: string, newTime: number) => {
    console.log("Updating time allocation for task:", taskId, "to:", newTime);
    setServiceTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === taskId ? { ...task, allocatedTime: newTime } : task
      )
    );
  }, []);

  // Handle toggling task completion
  const handleToggleTaskCompletion = useCallback((taskId: string) => {
    console.log("Toggling task completion for:", taskId);
    setServiceTasks(prevTasks => {
      const newTasks = prevTasks.map(task => 
        task.id === taskId ? { ...task, completed: !task.completed } : task
      );
      console.log("Updated tasks after toggle:", newTasks);
      return newTasks;
    });
  }, []);

  // Handle setting actual time spent
  const handleSetActualTime = useCallback((taskId: string, time: number) => {
    console.log("Setting actual time for task:", taskId, "to:", time);
    setServiceTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === taskId ? { ...task, actualTime: time } : task
      )
    );
  }, []);

  // Handle saving service progress with notification
  const handleSaveServiceProgress = useCallback(() => {
    if (currentBooking) {
      saveServiceProgress(currentBooking.id, serviceTasks);
    }
  }, [currentBooking, serviceTasks, saveServiceProgress]);

  return {
    serviceTasks,
    handleUpdateTimeAllocation,
    handleToggleTaskCompletion,
    handleSetActualTime,
    handleSaveServiceProgress
  };
};
