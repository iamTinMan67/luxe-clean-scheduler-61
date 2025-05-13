
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { AdditionalService } from "@/lib/types";

export function useAdditionalServicesManager(initialServices: AdditionalService[]) {
  const [services, setServices] = useState<AdditionalService[]>(initialServices);
  const [selectedService, setSelectedService] = useState<AdditionalService | null>(null);
  
  const handleSelectService = (service: AdditionalService) => {
    setSelectedService(service);
  };
  
  const handleSaveService = (service: AdditionalService) => {
    const isEditing = services.some(s => s.id === service.id);
    
    if (isEditing) {
      setServices(prev => prev.map(s => s.id === service.id ? service : s));
      toast.success("Service updated successfully");
    } else {
      setServices(prev => [...prev, service]);
      toast.success("Service added successfully");
    }
    
    setSelectedService(null);
  };
  
  const handleDeleteService = (serviceId: string) => {
    setServices(prev => prev.filter(service => service.id !== serviceId));
    setSelectedService(null);
    toast.success("Service deleted successfully");
  };
  
  const handleUpdateServiceDuration = (serviceId: string, duration: number) => {
    setServices(prev => 
      prev.map(service => 
        service.id === serviceId ? { ...service, duration } : service
      )
    );
    toast.success("Service duration updated");
  };

  return {
    services,
    selectedService,
    handleSelectService,
    handleSaveService,
    handleDeleteService,
    handleUpdateServiceDuration
  };
}
