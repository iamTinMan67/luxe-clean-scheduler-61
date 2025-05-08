import { useState, useEffect } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { InventoryItem, Van } from "@/types/vanInventory";

// Form schema for inventory item
export const inventoryItemSchema = z.object({
  name: z.string().min(1, "Name is required"),
  category: z.string().min(1, "Category is required"),
  quantity: z.coerce.number().min(0, "Quantity must be at least 0"),
  minLevel: z.coerce.number().min(0, "Minimum level must be at least 0"),
  vanId: z.string().min(1, "Van is required"),
});

export default function useInventoryItems(activeVanId: string) {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [editItem, setEditItem] = useState<InventoryItem | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  useEffect(() => {
    // Try to load inventory from localStorage
    const savedInventory = localStorage.getItem('vanInventory');
    if (savedInventory) {
      try {
        const parsedInventory = JSON.parse(savedInventory);
        // Update structure if missing vanId
        const updatedInventory = parsedInventory.map((item: InventoryItem) => ({
          ...item,
          vanId: item.vanId || "1", // Default to first van if none specified
        }));
        setInventory(updatedInventory);
      } catch (error) {
        console.error('Error parsing van inventory:', error);
        // Set default data if error
        setInventory(getDefaultInventory());
      }
    } else {
      // Set default data if none exists
      setInventory(getDefaultInventory());
      // Save to localStorage for future
      localStorage.setItem('vanInventory', JSON.stringify(getDefaultInventory()));
    }
  }, []);

  // Save to localStorage whenever inventory changes
  useEffect(() => {
    localStorage.setItem('vanInventory', JSON.stringify(inventory));
  }, [inventory]);

  const getDefaultInventory = (): InventoryItem[] => {
    return [
      { id: "1", name: "Microfiber Cloths", category: "Cleaning", quantity: 24, minLevel: 10, lastRestocked: "2023-05-15", vanId: "1" },
      { id: "2", name: "Interior Cleaner", category: "Chemicals", quantity: 3, minLevel: 2, lastRestocked: "2023-05-10", vanId: "1" },
      { id: "3", name: "Glass Cleaner", category: "Chemicals", quantity: 2, minLevel: 2, lastRestocked: "2023-05-10", vanId: "1" },
      { id: "4", name: "Tire Shine", category: "Chemicals", quantity: 1, minLevel: 1, lastRestocked: "2023-05-01", vanId: "1" },
      { id: "5", name: "Detailing Brushes", category: "Tools", quantity: 8, minLevel: 5, lastRestocked: "2023-04-28", vanId: "1" },
      { id: "6", name: "Pressure Washer", category: "Equipment", quantity: 1, minLevel: 1, lastRestocked: "2023-03-15", vanId: "1" },
      { id: "7", name: "Vacuum Cleaner", category: "Equipment", quantity: 1, minLevel: 1, lastRestocked: "2023-03-15", vanId: "1" },
      { id: "8", name: "Wax", category: "Chemicals", quantity: 2, minLevel: 1, lastRestocked: "2023-05-05", vanId: "1" },
      { id: "9", name: "Microfiber Cloths", category: "Cleaning", quantity: 18, minLevel: 8, lastRestocked: "2023-05-12", vanId: "2" },
      { id: "10", name: "Interior Cleaner", category: "Chemicals", quantity: 2, minLevel: 1, lastRestocked: "2023-05-08", vanId: "2" },
      { id: "11", name: "Tire Shine", category: "Chemicals", quantity: 1, minLevel: 1, lastRestocked: "2023-05-03", vanId: "2" },
    ];
  };

  // Handle quantity change
  const adjustQuantity = (id: string, amount: number, vans: Van[]) => {
    let updatedItem: InventoryItem | null = null;
    
    setInventory(prev => prev.map(item => {
      if (item.id === id) {
        const newQuantity = Math.max(0, item.quantity + amount);
        
        updatedItem = { 
          ...item, 
          quantity: newQuantity,
          lastRestocked: amount > 0 ? new Date().toISOString().split('T')[0] : item.lastRestocked 
        };
        
        return updatedItem;
      }
      return item;
    }));
    
    // If quantity was changed and we have item details, clear allocations in warehouse
    if (amount !== 0 && updatedItem) {
      clearWarehouseAllocation(updatedItem, vans);
    }
    
    toast.success(`Inventory quantity updated`, {
      description: amount > 0 ? "Item quantity increased" : "Item quantity decreased"
    });
  };

  // Clear allocation in warehouse inventory when van stock changes
  const clearWarehouseAllocation = (item: InventoryItem, vans: Van[]) => {
    try {
      const warehouseInventory = localStorage.getItem('warehouseInventory');
      if (warehouseInventory) {
        const parsedInventory = JSON.parse(warehouseInventory);
        const currentVan = vans.find(van => van.id === item.vanId);
        
        if (currentVan) {
          let updated = false;
          
          // Find matching warehouse items by name
          const updatedWarehouseInventory = parsedInventory.map((warehouseItem: any) => {
            // Only clear allocation if the names match and there's an allocation for this van
            if (warehouseItem.name === item.name && 
                warehouseItem.allocatedStock && 
                warehouseItem.allocatedStock[currentVan.registration]) {
              
              updated = true;
              const updatedAllocatedStock = { ...warehouseItem.allocatedStock };
              // Clear the allocation for this van
              updatedAllocatedStock[currentVan.registration] = 0;
              
              return {
                ...warehouseItem,
                allocatedStock: updatedAllocatedStock,
                lastUpdated: new Date().toISOString().split('T')[0]
              };
            }
            return warehouseItem;
          });
          
          if (updated) {
            localStorage.setItem('warehouseInventory', JSON.stringify(updatedWarehouseInventory));
          }
        }
      }
    } catch (error) {
      console.error('Error clearing warehouse allocations:', error);
      // We don't show a toast here to avoid confusing the user
      // This is a background operation that shouldn't interrupt their flow
    }
  };

  const handleAddItem = () => {
    setEditItem(null);
    setIsEditDialogOpen(true);
  };

  const handleEditItem = (item: InventoryItem) => {
    setEditItem(item);
    setIsEditDialogOpen(true);
  };

  const handleDeleteItem = (id: string) => {
    setInventory(prev => prev.filter(item => item.id !== id));
    toast.success("Item deleted", {
      description: "The inventory item has been removed"
    });
  };

  // Update the handleSaveItem function to clear allocations when item quantity changes
  const handleSaveItem = (values: z.infer<typeof inventoryItemSchema>) => {
    if (editItem) {
      // Check if quantity changed
      const quantityChanged = values.quantity !== editItem.quantity;
      
      // Update existing item
      setInventory(prev => prev.map(item => 
        item.id === editItem.id 
          ? { 
              ...item, 
              ...values, 
              lastRestocked: values.quantity > item.quantity 
                ? new Date().toISOString().split('T')[0] 
                : item.lastRestocked 
            }
          : item
      ));

      // If quantity changed, clear allocations in warehouse
      if (quantityChanged) {
        // We need to load vans to get the registration
        try {
          const savedVans = localStorage.getItem('vans');
          if (savedVans) {
            const vans = JSON.parse(savedVans);
            clearWarehouseAllocation({...editItem, ...values}, vans);
          }
        } catch (error) {
          console.error('Error loading vans:', error);
        }
      }
      
      toast.success("Item updated", {
        description: "The inventory item has been updated"
      });
    } else {
      // Add new item
      const newItem: InventoryItem = {
        id: Date.now().toString(),
        name: values.name,
        category: values.category,
        quantity: values.quantity,
        minLevel: values.minLevel,
        vanId: values.vanId,
        lastRestocked: new Date().toISOString().split('T')[0]
      };
      setInventory(prev => [...prev, newItem]);
      toast.success("Item added", {
        description: "New item added to van inventory"
      });
    }
    
    setIsEditDialogOpen(false);
  };

  const handleRestockRequest = () => {
    // Find low stock items
    const lowStockItems = inventory.filter(item => item.vanId === activeVanId && item.quantity <= item.minLevel);
    
    if (lowStockItems.length > 0) {
      toast.success(`Restock request sent for ${lowStockItems.length} items`, {
        description: "The warehouse will process your request soon"
      });
    } else {
      toast.info("No items need restocking at this time");
    }
  };

  return {
    inventory,
    editItem,
    isEditDialogOpen,
    setIsEditDialogOpen,
    adjustQuantity,
    handleAddItem,
    handleEditItem,
    handleDeleteItem,
    handleSaveItem,
    handleRestockRequest
  };
}
