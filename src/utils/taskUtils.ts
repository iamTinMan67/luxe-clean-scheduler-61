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
    // Add null check for service
    if (service && typeof service === 'object' && 'duration' in service) {
      return total + (service.duration || 0);
    }
    return total;
  }, 0);

  return packageTime + additionalTime;
};
