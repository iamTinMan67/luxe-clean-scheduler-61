
import { useState, useEffect, useCallback } from 'react';
import { Booking } from "@/types/booking";
import { ServiceTaskItem } from "@/types/task";
import { packageOptions, additionalServices } from "@/data/servicePackageData";
import { generateServiceTasksFromPackage, loadServiceTasksProgress } from "@/utils/taskUtils";
import { useDataSynchronization } from './tracking/useDataSynchronization';
import { supabase } from "@/integrations/supabase/client";

export const useServiceTasksV2 = (selectedBookingId: string, currentBooking: Booking | null) => {
  const [serviceTasks, setServiceTasks] = useState<ServiceTaskItem[]>([]);
  const { syncServiceProgress, syncBookingData } = useDataSynchronization();
  
  // Generate service tasks when booking changes
  useEffect(() => {
    const loadTasks = async () => {
      if (currentBooking) {
        console.log("=== Loading Tasks V2 ===");
        console.log("Booking:", currentBooking.id, currentBooking.customer, currentBooking.status);
        
        // Generate tasks from package with stable IDs
        const generatedTasks = generateServiceTasksFromPackage(currentBooking, packageOptions, additionalServices);
        
        // Fetch additional services from database for this booking
        try {
          const { data: bookingAdditionalServices, error } = await supabase
            .from('booking_additional_services')
            .select('*')
            .eq('booking_id', currentBooking.id);
          
          if (!error && bookingAdditionalServices) {
            const additionalServiceTasks = bookingAdditionalServices.map((service, index) => ({
              id: `additional-${service.service_name.toLowerCase().replace(/\s+/g, '-')}-${index}`,
              name: service.service_name,
              completed: false,
              allocatedTime: 30
            }));
            
            generatedTasks.push(...additionalServiceTasks);
            console.log("Added additional service tasks:", additionalServiceTasks.length);
          }
        } catch (error) {
          console.error('Error fetching additional services:', error);
        }
        
        const tasksWithProgress = loadServiceTasksProgress(generatedTasks, currentBooking.id);
        console.log("Final tasks with progress:", tasksWithProgress.length);
        setServiceTasks(tasksWithProgress);
      } else {
        setServiceTasks([]);
      }
    };

    loadTasks();
  }, [currentBooking?.id]);

  // Handle updating time allocation
  const handleUpdateTimeAllocation = useCallback((taskId: string, newTime: number) => {
    console.log("=== Updating Time Allocation V2 ===");
    console.log("Task ID:", taskId, "New time:", newTime);
    
    setServiceTasks(prevTasks => {
      const updatedTasks = prevTasks.map(task => 
        task.id === taskId ? { ...task, allocatedTime: newTime } : task
      );
      
      // Sync to localStorage immediately
      if (currentBooking) {
        syncServiceProgress(currentBooking.id, updatedTasks);
      }
      
      return updatedTasks;
    });
  }, [currentBooking, syncServiceProgress]);

  // Handle toggling task completion
  const handleToggleTaskCompletion = useCallback((taskId: string) => {
    console.log("=== Toggling Task Completion V2 ===");
    console.log("Task ID:", taskId);
    
    setServiceTasks(prevTasks => {
      const updatedTasks = prevTasks.map(task => 
        task.id === taskId ? { 
          ...task, 
          completed: !task.completed,
          completedAt: !task.completed ? new Date().toISOString() : undefined
        } : task
      );
      
      console.log("Updated tasks:", updatedTasks.map(t => `${t.name}: ${t.completed}`));
      
      // Sync to localStorage immediately
      if (currentBooking) {
        syncServiceProgress(currentBooking.id, updatedTasks);
        
        // Update booking status if all tasks completed
        const allCompleted = updatedTasks.every(task => task.completed);
        if (allCompleted && currentBooking.status !== "finished") {
          const updatedBooking = { ...currentBooking, status: "finished" as const };
          syncBookingData(updatedBooking);
        }
      }
      
      return updatedTasks;
    });
  }, [currentBooking, syncServiceProgress, syncBookingData]);

  // Handle setting actual time spent
  const handleSetActualTime = useCallback((taskId: string, time: number) => {
    console.log("=== Setting Actual Time V2 ===");
    console.log("Task ID:", taskId, "Time:", time);
    
    setServiceTasks(prevTasks => {
      const updatedTasks = prevTasks.map(task => 
        task.id === taskId ? { ...task, actualTime: time } : task
      );
      
      // Sync to localStorage immediately
      if (currentBooking) {
        syncServiceProgress(currentBooking.id, updatedTasks);
      }
      
      return updatedTasks;
    });
  }, [currentBooking, syncServiceProgress]);

  // Handle saving service progress with enhanced feedback
  const handleSaveServiceProgress = useCallback(() => {
    if (currentBooking && serviceTasks.length > 0) {
      console.log("=== Manual Save Service Progress V2 ===");
      const success = syncServiceProgress(currentBooking.id, serviceTasks);
      if (success) {
        console.log("Manual save successful");
      } else {
        console.error("Manual save failed");
      }
    }
  }, [currentBooking, serviceTasks, syncServiceProgress]);

  return {
    serviceTasks,
    handleUpdateTimeAllocation,
    handleToggleTaskCompletion,
    handleSetActualTime,
    handleSaveServiceProgress
  };
};
