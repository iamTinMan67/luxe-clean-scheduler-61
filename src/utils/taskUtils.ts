
import { Booking } from '@/types/booking';
import { ServiceTaskItem } from '@/types/task';
import { PackageOption, AdditionalService } from '@/lib/types';

export const calculateTotalBookingTime = (
  packageTasks: any[],
  additionalServices: any[]
): number => {
  // Calculate package tasks time
  const packageTime = packageTasks.reduce((total, task) => {
    return total + (task.estimatedMinutes || 0);
  }, 0);

  // Calculate additional services time
  const additionalTime = additionalServices.reduce((total, service) => {
    // Add comprehensive null/undefined checks for service
    if (!service || typeof service !== 'object') {
      return total;
    }
    
    // Check for duration property with proper null safety
    if ('duration' in service && typeof service.duration === 'number') {
      return total + service.duration;
    }
    
    // Check for estimatedMinutes as fallback
    if ('estimatedMinutes' in service && typeof service.estimatedMinutes === 'number') {
      return total + service.estimatedMinutes;
    }
    
    return total;
  }, 0);

  return packageTime + additionalTime;
};

export const generateServiceTasksFromPackage = (
  booking: Booking,
  packageOptions: PackageOption[],
  additionalServices: AdditionalService[]
): ServiceTaskItem[] => {
  const tasks: ServiceTaskItem[] = [];
  
  // Find the package option for this booking
  const packageOption = packageOptions.find(p => p.type === booking.packageType);
  
  if (packageOption && packageOption.tasks) {
    // Add tasks from the package
    packageOption.tasks.forEach((task, index) => {
      tasks.push({
        id: `package-${task.id}-${index}`,
        name: task.name,
        completed: false,
        allocatedTime: task.duration || 30
      });
    });
  }
  
  return tasks;
};

export const loadServiceTasksProgress = (
  generatedTasks: ServiceTaskItem[],
  bookingId: string
): ServiceTaskItem[] => {
  try {
    const savedProgress = JSON.parse(localStorage.getItem('serviceProgress') || '[]');
    const bookingProgress = savedProgress.find((p: any) => p.bookingId === bookingId);
    
    if (bookingProgress && bookingProgress.tasks) {
      // Merge saved progress with generated tasks
      return generatedTasks.map(task => {
        const savedTask = bookingProgress.tasks.find((t: ServiceTaskItem) => t.id === task.id);
        return savedTask ? { ...task, ...savedTask } : task;
      });
    }
  } catch (error) {
    console.error('Error loading service progress:', error);
  }
  
  return generatedTasks;
};

export const updateTrackingProgress = (
  bookingId: string,
  serviceTasks: ServiceTaskItem[]
): void => {
  try {
    const completedTasks = serviceTasks.filter(task => task.completed).length;
    const totalTasks = serviceTasks.length;
    const progressPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    
    // Update tracking progress in localStorage
    const trackingData = {
      bookingId,
      progressPercentage,
      lastUpdated: new Date().toISOString(),
      currentStep: completedTasks === totalTasks ? 'Service Complete' : 'In Progress'
    };
    
    const existingTracking = JSON.parse(localStorage.getItem('trackingProgress') || '[]');
    const existingIndex = existingTracking.findIndex((t: any) => t.bookingId === bookingId);
    
    if (existingIndex >= 0) {
      existingTracking[existingIndex] = trackingData;
    } else {
      existingTracking.push(trackingData);
    }
    
    localStorage.setItem('trackingProgress', JSON.stringify(existingTracking));
  } catch (error) {
    console.error('Error updating tracking progress:', error);
  }
};
