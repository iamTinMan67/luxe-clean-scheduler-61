
import { useState } from "react";
import { Vehicle, VehicleType, PackageType, AdditionalService } from "@/lib/types";
import { toast } from "sonner";

export const useVehicleState = (additionalServices: AdditionalService[]) => {
  // State for the current vehicle
  const [vehicles, setVehicles] = useState<Vehicle[]>([
    {
      id: "1",
      type: "car",
      condition: 5,
      package: "medium" as PackageType,
      additionalServices: []
    }
  ]);
  
  const [currentVehicleIndex, setCurrentVehicleIndex] = useState(0);
  const currentVehicle = vehicles[currentVehicleIndex];
  
  // Update vehicle type
  const handleVehicleTypeChange = (type: VehicleType) => {
    setVehicles(prev => {
      const updated = [...prev];
      updated[currentVehicleIndex] = {
        ...updated[currentVehicleIndex],
        type
      };
      return updated;
    });
  };
  
  // Update vehicle condition
  const handleConditionChange = (condition: number) => {
    setVehicles(prev => {
      const updated = [...prev];
      updated[currentVehicleIndex] = {
        ...updated[currentVehicleIndex],
        condition
      };
      return updated;
    });
  };
  
  // Update package selection
  const handlePackageSelect = (packageType: PackageType) => {
    setVehicles(prev => {
      const updated = [...prev];
      updated[currentVehicleIndex] = {
        ...updated[currentVehicleIndex],
        package: packageType
      };
      return updated;
    });
  };
  
  // Toggle additional service
  const handleAdditionalServiceToggle = (serviceId: string) => {
    setVehicles(prev => {
      const updated = [...prev];
      const currentServices = [...updated[currentVehicleIndex].additionalServices];
      
      const existingIndex = currentServices.findIndex(s => s.id === serviceId);
      
      if (existingIndex >= 0) {
        // Remove the service
        currentServices.splice(existingIndex, 1);
      } else {
        // Add the service
        const serviceToAdd = additionalServices.find(s => s.id === serviceId);
        if (serviceToAdd) {
          currentServices.push({...serviceToAdd, selected: true});
        }
      }
      
      updated[currentVehicleIndex] = {
        ...updated[currentVehicleIndex],
        additionalServices: currentServices
      };
      
      return updated;
    });
  };
  
  // Add another vehicle
  const handleAddVehicle = () => {
    const newVehicle: Vehicle = {
      id: `${vehicles.length + 1}`,
      type: "car",
      condition: 5,
      package: "medium" as PackageType,
      additionalServices: []
    };
    
    setVehicles(prev => [...prev, newVehicle]);
    setCurrentVehicleIndex(vehicles.length);
    
    toast.success("New vehicle added", {
      description: `Vehicle ${vehicles.length + 1} added to your quote.`
    });
  };
  
  // Remove a vehicle
  const handleRemoveVehicle = (index: number) => {
    if (vehicles.length <= 1) {
      toast.error("Cannot remove", {
        description: "None to delete."
      });
      return;
    }
    
    setVehicles(prev => {
      const updated = [...prev];
      updated.splice(index, 1);
      return updated;
    });
    
    if (currentVehicleIndex >= index && currentVehicleIndex > 0) {
      setCurrentVehicleIndex(currentVehicleIndex - 1);
    }
    
    toast.success("Vehicle removed", {
      description: `Vehicle has been removed from your quote.`
    });
  };

  return {
    vehicles,
    currentVehicleIndex,
    setCurrentVehicleIndex,
    currentVehicle,
    handleVehicleTypeChange,
    handleConditionChange,
    handlePackageSelect,
    handleAdditionalServiceToggle,
    handleAddVehicle,
    handleRemoveVehicle
  };
};
