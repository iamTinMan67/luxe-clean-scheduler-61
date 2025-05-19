
import { packageOptions, additionalServices } from "@/data/servicePackageData";
import { Booking } from "@/types/booking";
import { ServiceTaskItem } from "@/types/task";

export const useServiceTaskGenerator = () => {
  // Generate service tasks based on the selected package and additional services
  const generateServiceTasksFromPackage = (booking: Booking): ServiceTaskItem[] => {
    const tasks: ServiceTaskItem[] = [];
    
    // Find the package details
    const packageDetail = packageOptions.find(p => p.type === booking.packageType);
    
    // Add tasks from the selected package
    if (packageDetail && packageDetail.tasks) {
      packageDetail.tasks.forEach(task => {
        tasks.push({
          id: `${task.id}-${Date.now()}`,
          name: task.name,
          completed: false,
          allocatedTime: task.duration
        });
      });
    }
    
    // Add tasks from additional services if any
    if (booking.additionalServices && booking.additionalServices.length > 0) {
      booking.additionalServices.forEach(serviceId => {
        const service = additionalServices.find(s => s.id === serviceId);
        if (service) {
          tasks.push({
            id: `${service.id}-${Date.now()}`,
            name: service.name,
            completed: false,
            allocatedTime: service.duration || 30 // Default to 30 minutes if not specified
          });
        }
      });
    }
    
    return tasks;
  };

  // Load saved progress for service tasks
  const loadSavedProgress = (booking: Booking, generatedTasks: ServiceTaskItem[]): ServiceTaskItem[] => {
    const savedProgress = JSON.parse(localStorage.getItem('serviceProgress') || '[]');
    const existingProgress = savedProgress.find((p: any) => p.bookingId === booking.id);
    
    if (existingProgress) {
      // Merge saved progress with newly generated tasks
      return generatedTasks.map(task => {
        const savedTask = existingProgress.tasks.find((t: any) => t.name === task.name);
        return savedTask ? { ...task, ...savedTask } : task;
      });
    }
    
    return generatedTasks;
  };

  return {
    generateServiceTasksFromPackage,
    loadSavedProgress
  };
};
