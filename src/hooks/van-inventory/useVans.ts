
import { useState, useEffect } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { Van } from "@/types/vanInventory";

// Form schema for van
export const vanSchema = z.object({
  registration: z.string().min(1, "Registration is required"),
  name: z.string().min(1, "Name is required"),
});

export default function useVans() {
  const [vans, setVans] = useState<Van[]>([]);
  const [activeVanId, setActiveVanId] = useState<string>("");
  const [editVan, setEditVan] = useState<Van | null>(null);
  const [isVanDialogOpen, setIsVanDialogOpen] = useState(false);

  useEffect(() => {
    // Load vans from localStorage
    const savedVans = localStorage.getItem('vans');
    if (savedVans) {
      try {
        const parsedVans = JSON.parse(savedVans);
        setVans(parsedVans);
        // Set active van to first one if it exists
        if (parsedVans.length > 0 && !activeVanId) {
          setActiveVanId(parsedVans[0].id);
        }
      } catch (error) {
        console.error('Error parsing vans:', error);
        // Set default vans if error
        const defaultVans = getDefaultVans();
        setVans(defaultVans);
        setActiveVanId(defaultVans[0].id);
        localStorage.setItem('vans', JSON.stringify(defaultVans));
      }
    } else {
      // Set default vans if none exists
      const defaultVans = getDefaultVans();
      setVans(defaultVans);
      setActiveVanId(defaultVans[0].id);
      localStorage.setItem('vans', JSON.stringify(defaultVans));
    }
  }, []);

  // Set active van if not set yet
  useEffect(() => {
    if (vans.length > 0 && !activeVanId) {
      setActiveVanId(vans[0].id);
    }
  }, [vans, activeVanId]);

  // Save to localStorage whenever vans change
  useEffect(() => {
    localStorage.setItem('vans', JSON.stringify(vans));
  }, [vans]);

  const getDefaultVans = (): Van[] => {
    return [
      { id: "1", registration: "AB12 CDE", name: "Van 1" },
      { id: "2", registration: "FG34 HIJ", name: "Van 2" },
    ];
  };

  const handleAddVan = () => {
    setEditVan(null);
    setIsVanDialogOpen(true);
  };

  const handleEditVan = (van: Van) => {
    setEditVan(van);
    setIsVanDialogOpen(true);
  };

  const handleDeleteVan = (id: string) => {
    if (vans.length <= 1) {
      toast.error("Cannot delete the only van", {
        description: "You must have at least one van in the system"
      });
      return;
    }
    
    // Delete van and its inventory
    setVans(prev => prev.filter(van => van.id !== id));
    
    // If active van is deleted, set active van to first available
    if (activeVanId === id && vans.length > 1) {
      const remainingVans = vans.filter(van => van.id !== id);
      if (remainingVans.length > 0) {
        setActiveVanId(remainingVans[0].id);
      }
    }
    
    toast.success("Van deleted", {
      description: "The van and its inventory have been removed"
    });
  };

  const handleSaveVan = (values: z.infer<typeof vanSchema>) => {
    if (editVan) {
      // Update existing van
      setVans(prev => prev.map(van => 
        van.id === editVan.id 
          ? { ...van, ...values }
          : van
      ));
      toast.success("Van updated", {
        description: "The van details have been updated"
      });
    } else {
      // Add new van
      const newVan: Van = {
        id: Date.now().toString(),
        registration: values.registration,
        name: values.name
      };
      setVans(prev => [...prev, newVan]);
      
      // Set as active van if it's the first one
      if (vans.length === 0) {
        setActiveVanId(newVan.id);
      }
      
      toast.success("Van added", {
        description: "New van added to the system"
      });
    }
    
    setIsVanDialogOpen(false);
  };

  return {
    vans,
    activeVanId,
    setActiveVanId,
    editVan,
    isVanDialogOpen,
    setIsVanDialogOpen,
    handleAddVan,
    handleEditVan,
    handleDeleteVan,
    handleSaveVan
  };
}
