
import { Vehicle, PackageOption } from "@/lib/types";

export const calculateTotalPrice = (vehicles: Vehicle[], packageOptions: PackageOption[]): number => {
  return vehicles.reduce((total, vehicle) => {
    // Get base package price
    const packageOption = packageOptions.find(p => p.type === vehicle.package);
    
    // Since we're now using 'medium' as the default size, get the price for medium
    const basePrice = packageOption?.basePrice[vehicle.type].medium || 0;
    
    // Add additional services
    const additionalPrice = vehicle.additionalServices.reduce(
      (sum, service) => sum + service.price, 
      0
    );
    
    return total + basePrice + additionalPrice;
  }, 0);
};
