
import { Vehicle, PackageOption } from "@/lib/types";

export const calculateTotalPrice = (vehicles: Vehicle[], packageOptions: PackageOption[]): number => {
  return vehicles.reduce((total, vehicle) => {
    // Get base package price
    const packageOption = packageOptions.find(p => p.type === vehicle.package);
    const basePrice = packageOption?.basePrice[vehicle.type] || 0;
    
    // Add additional services
    const additionalPrice = vehicle.additionalServices.reduce(
      (sum, service) => sum + service.price, 
      0
    );
    
    return total + basePrice + additionalPrice;
  }, 0);
};
