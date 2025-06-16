
import { ServiceTaskItem } from "@/types/task";
import { Booking } from "@/types/booking";

// Update tracking progress for the customer-facing progress page
export const updateTrackingProgress = (bookingId: string, tasks: ServiceTaskItem[]) => {
  const completedTasks = tasks.filter(task => task.completed).length;
  const totalTasks = tasks.length;
  const progressPercentage = Math.round((completedTasks / totalTasks) * 100);
  
  // Update booking progress
  const confirmedBookings = JSON.parse(localStorage.getItem('confirmedBookings') || '[]');
  const updatedBookings = confirmedBookings.map((booking: Booking) => {
    if (booking.id === bookingId) {
      return {
        ...booking,
        progressPercentage: progressPercentage
      };
    }
    return booking;
  });
  
  localStorage.setItem('confirmedBookings', JSON.stringify(updatedBookings));
  
  // Map tasks to booking steps for the progress page
  const bookingSteps = tasks.map((task, index) => ({
    id: index + 1,
    name: task.name,
    completed: task.completed,
    time: task.completed ? new Date().toISOString() : undefined,
    estimatedTime: `${task.allocatedTime} minutes`
  }));
  
  // Store steps for the progress tracking page
  const progressData = {
    bookingId,
    steps: bookingSteps,
    updatedAt: new Date().toISOString()
  };
  
  const savedProgressData = JSON.parse(localStorage.getItem('bookingProgressData') || '[]');
  const existingDataIndex = savedProgressData.findIndex((p: any) => p.bookingId === bookingId);
  
  if (existingDataIndex >= 0) {
    savedProgressData[existingDataIndex] = progressData;
  } else {
    savedProgressData.push(progressData);
  }
  
  localStorage.setItem('bookingProgressData', JSON.stringify(savedProgressData));
};

// Generate service tasks based on the selected package and additional services
export const generateServiceTasksFromPackage = (booking: Booking, packageOptions: any[], additionalServices: any[]) => {
  const tasks: ServiceTaskItem[] = [];
  
  // Find the package details
  const packageDetail = packageOptions.find(p => p.type === booking.packageType);
  
  // Add tasks from the selected package with stable IDs
  if (packageDetail && packageDetail.tasks) {
    packageDetail.tasks.forEach((task, index) => {
      tasks.push({
        id: `package-${booking.packageType}-${task.name.toLowerCase().replace(/\s+/g, '-')}-${index}`,
        name: task.name,
        completed: false,
        allocatedTime: task.duration
      });
    });
  }
  
  // Add tasks from additional services if any
  if (booking.additionalServices && booking.additionalServices.length > 0) {
    booking.additionalServices.forEach((service, index) => {
      // First check if service is not null or undefined
      if (service != null) {
        // Handle service objects with name property
        if (typeof service === 'object' && 'name' in service) {
          const serviceObj = service as { name: string; duration?: number };
          if (typeof serviceObj.name === 'string') {
            tasks.push({
              id: `additional-${serviceObj.name.toLowerCase().replace(/\s+/g, '-')}-${index}`,
              name: serviceObj.name,
              completed: false,
              allocatedTime: serviceObj.duration || 30 // Default to 30 minutes if not specified
            });
          }
        } else if (typeof service === 'string' || typeof service === 'number') {
          // Handle legacy format where service might be just an ID
          const serviceDetail = additionalServices.find(s => s.id === service);
          if (serviceDetail) {
            tasks.push({
              id: `additional-${serviceDetail.name.toLowerCase().replace(/\s+/g, '-')}-${index}`,
              name: serviceDetail.name,
              completed: false,
              allocatedTime: serviceDetail.duration || 30
            });
          }
        }
      }
    });
  }
  
  return tasks;
};

// Load and merge any previously saved progress with newly generated tasks
export const loadServiceTasksProgress = (tasks: ServiceTaskItem[], bookingId: string) => {
  const savedProgress = JSON.parse(localStorage.getItem('serviceProgress') || '[]');
  const existingProgress = savedProgress.find((p: any) => p.bookingId === bookingId);
  
  if (existingProgress) {
    // Merge saved progress with newly generated tasks by matching task names (more stable than IDs)
    return tasks.map(task => {
      const savedTask = existingProgress.tasks.find((t: any) => t.name === task.name);
      return savedTask ? { ...task, completed: savedTask.completed, actualTime: savedTask.actualTime } : task;
    });
  }
  
  return tasks;
};
