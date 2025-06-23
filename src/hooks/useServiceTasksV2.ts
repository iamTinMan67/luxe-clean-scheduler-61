import { useState, useEffect, useCallback } from 'react';
import { Booking } from "@/types/booking";
import { ServiceTaskItem } from "@/types/task";
import { packageOptions, additionalServices } from "@/data/servicePackageData";
import { generateServiceTasksFromPackage, loadServiceTasksProgress } from "@/utils/taskUtils";
import { trackingDataSync } from '@/services/trackingDataSync';
import { supabase } from "@/integrations/supabase/client";

export const useServiceTasksV2 = (selectedBookingId: string, currentBooking: Booking | null) => {
  const [serviceTasks, setServiceTasks] = useState<ServiceTaskItem[]>([]);
  
  // Generate service tasks when booking changes
  useEffect(() => {
    const loadTasks = async () => {
      if (currentBooking) {
        console.log("=== Loading Tasks V2 (Enhanced) ===");
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

  // Handle updating time allocation with enhanced sync
  const handleUpdateTimeAllocation = useCallback((taskId: string, newTime: number) => {
    console.log("=== Enhanced Updating Time Allocation ===");
    console.log("Task ID:", taskId, "New time:", newTime);
    
    setServiceTasks(prevTasks => {
      const updatedTasks = prevTasks.map(task => 
        task.id === taskId ? { ...task, allocatedTime: newTime } : task
      );
      
      // Use enhanced sync service
      if (currentBooking) {
        trackingDataSync.syncServiceProgress(currentBooking.id, updatedTasks);
      }
      
      return updatedTasks;
    });
  }, [currentBooking]);

  // Handle toggling task completion with enhanced sync
  const handleToggleTaskCompletion = useCallback((taskId: string) => {
    console.log("=== Enhanced Toggling Task Completion ===");
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
      
      // Use enhanced sync service (includes automatic status updates)
      if (currentBooking) {
        trackingDataSync.syncServiceProgress(currentBooking.id, updatedTasks);
      }
      
      return updatedTasks;
    });
  }, [currentBooking]);

  // Handle setting actual time spent with enhanced sync
  const handleSetActualTime = useCallback((taskId: string, time: number) => {
    console.log("=== Enhanced Setting Actual Time ===");
    console.log("Task ID:", taskId, "Time:", time);
    
    setServiceTasks(prevTasks => {
      const updatedTasks = prevTasks.map(task => 
        task.id === taskId ? { ...task, actualTime: time } : task
      );
      
      // Use enhanced sync service
      if (currentBooking) {
        trackingDataSync.syncServiceProgress(currentBooking.id, updatedTasks);
      }
      
      return updatedTasks;
    });
  }, [currentBooking]);

  // Handle saving service progress with enhanced feedback
  const handleSaveServiceProgress = useCallback(() => {
    if (currentBooking && serviceTasks.length > 0) {
      console.log("=== Enhanced Manual Save Service Progress ===");
      const success = trackingDataSync.syncServiceProgress(currentBooking.id, serviceTasks);
      if (success) {
        console.log("Enhanced manual save successful");
      } else {
        console.error("Enhanced manual save failed");
      }
    }
  }, [currentBooking, serviceTasks]);

  return {
    serviceTasks,
    handleUpdateTimeAllocation,
    handleToggleTaskCompletion,
    handleSetActualTime,
    handleSaveServiceProgress
  };
};
