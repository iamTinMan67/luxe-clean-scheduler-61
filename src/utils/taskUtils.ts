
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
