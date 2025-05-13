
import { Vehicle, PackageOption, ServiceTask, AdditionalService } from "@/lib/types";

export const calculateTotalPrice = (vehicles: Vehicle[], packageOptions: PackageOption[]): number => {
  return vehicles.reduce((total, vehicle) => {
    // Get package option
    const packageOption = packageOptions.find(p => p.type === vehicle.package);
    
    if (!packageOption) return total;
    
    // Start with base price
    let vehicleTotal = packageOption.basePrice;
    
    // Add additional services
    const additionalPrice = vehicle.additionalServices.reduce(
      (sum, service) => sum + service.price, 
      0
    );
    
    return total + vehicleTotal + additionalPrice;
  }, 0);
};

// New function to calculate task-based price
export const calculateTaskBasedPrice = (tasks: ServiceTask[]): number => {
  return tasks.reduce((total, task) => {
    if (task.included) return total; // Don't add price for included tasks
    return total + task.price;
  }, 0);
};

// Calculate total time for a package
export const calculateTotalTime = (tasks: ServiceTask[]): number => {
  return tasks.reduce((total, task) => total + task.duration, 0);
};

// Calculate total time for additional services
export const calculateAdditionalServicesTime = (services: AdditionalService[]): number => {
  return services.reduce((total, service) => total + (service.duration || 0), 0);
};

// Calculate total time for a booking (package + additional services)
export const calculateTotalBookingTime = (
  packageTasks: ServiceTask[], 
  additionalServices: AdditionalService[]
): number => {
  const packageTime = calculateTotalTime(packageTasks);
  const additionalTime = calculateAdditionalServicesTime(additionalServices);
  return packageTime + additionalTime;
};
