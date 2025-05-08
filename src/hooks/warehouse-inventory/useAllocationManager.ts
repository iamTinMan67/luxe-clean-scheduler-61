
import { useState } from "react";
import { toast } from "sonner";
import { WarehouseItem } from "@/types/warehouseInventory";
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
    
    // Update warehouse inventory allocated stock
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
    
    // Update van inventory
    try {
      const vanInventory = localStorage.getItem('vanInventory');
      
      if (vanInventory) {
        const parsedInventory = JSON.parse(vanInventory);
        
        // Find if the item already exists in the van's inventory
        const existingItemIndex = parsedInventory.findIndex((item: any) => 
          item.name === selectedItemForAllocation.name && item.vanId === values.vanId
        );
        
        if (existingItemIndex !== -1) {
          // Update existing item quantity
          parsedInventory[existingItemIndex].quantity += values.quantity;
          parsedInventory[existingItemIndex].lastRestocked = new Date().toISOString().split('T')[0];
        } else {
          // Add new item to van inventory
          const newItem = {
            id: Date.now().toString(),
            name: selectedItemForAllocation.name,
            category: selectedItemForAllocation.category,
            quantity: values.quantity,
            minLevel: Math.max(1, Math.floor(values.quantity / 4)), // Set a reasonable min level
            vanId: values.vanId,
            lastRestocked: new Date().toISOString().split('T')[0]
          };
          
          parsedInventory.push(newItem);
        }
        
        // Save updated van inventory
        localStorage.setItem('vanInventory', JSON.stringify(parsedInventory));
      }
    } catch (error) {
      console.error('Error updating van inventory:', error);
      toast.error("Failed to update van inventory", {
        description: "The allocation was recorded but van inventory wasn't updated"
      });
    }
    
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
