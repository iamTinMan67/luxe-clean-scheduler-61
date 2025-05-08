
import { useState } from "react";
import { toast } from "sonner";
import { WarehouseItem } from "./useWarehouseInventory";
import { Van } from "@/types/vanInventory";

export default function useAllocationManager(inventory: WarehouseItem[], setInventory: React.Dispatch<React.SetStateAction<WarehouseItem[]>>) {
  const [isAllocateDialogOpen, setIsAllocateDialogOpen] = useState(false);
  const [selectedItemForAllocation, setSelectedItemForAllocation] = useState<WarehouseItem | null>(null);

  const handleAllocateStock = (item: WarehouseItem) => {
    setSelectedItemForAllocation(item);
    setIsAllocateDialogOpen(true);
  };

  const handleSaveAllocation = (values: { vanId: string; quantity: number }, currentStock: (item: WarehouseItem) => number, vans: Van[]) => {
    if (!selectedItemForAllocation) return;
    
    const selectedVan = vans.find(van => van.id === values.vanId);
    if (!selectedVan) return;
    
    const availableStock = currentStock(selectedItemForAllocation);
    
    if (values.quantity > availableStock) {
      toast.error("Insufficient stock", {
        description: `Only ${availableStock} units available for allocation`
      });
      return;
    }
    
    setInventory(prev => prev.map(item => {
      if (item.id === selectedItemForAllocation.id) {
        const updatedAllocatedStock = { ...item.allocatedStock };
        updatedAllocatedStock[selectedVan.registration] = (updatedAllocatedStock[selectedVan.registration] || 0) + values.quantity;
        
        return {
          ...item,
          allocatedStock: updatedAllocatedStock,
          lastUpdated: new Date().toISOString().split('T')[0]
        };
      }
      return item;
    }));
    
    toast.success("Stock allocated", {
      description: `${values.quantity} units allocated to ${selectedVan.registration}`
    });
    
    setIsAllocateDialogOpen(false);
  };

  return {
    isAllocateDialogOpen,
    setIsAllocateDialogOpen,
    selectedItemForAllocation,
    handleAllocateStock,
    handleSaveAllocation
  };
}
