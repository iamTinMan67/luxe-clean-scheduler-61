
import { useState } from "react";
import { WarehouseItem } from "@/types/warehouseInventory";
import { toast } from "sonner";

export default function useItemEditor(inventory: WarehouseItem[], setInventory: React.Dispatch<React.SetStateAction<WarehouseItem[]>>) {
  const [editItem, setEditItem] = useState<WarehouseItem | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const handleAddNewItem = () => {
    setEditItem(null);
    setIsEditDialogOpen(true);
  };

  const handleEditItem = (item: WarehouseItem) => {
    setEditItem(item);
    setIsEditDialogOpen(true);
  };

  const handleDeleteItem = (id: string) => {
    setInventory(prev => prev.filter(item => item.id !== id));
    toast.success("Item deleted", {
      description: "The inventory item has been removed"
    });
  };

  const handleSaveItem = (values: {
    name: string;
    category: string;
    stockIn: number;
    stockOut: number;
    supplier: string;
    reorderPoint: number;
  }) => {
    const now = new Date().toISOString().split('T')[0];
    
    if (editItem) {
      // Update existing item
      setInventory(prev => prev.map(item => 
        item.id === editItem.id 
          ? { 
              ...item, 
              ...values, 
              lastUpdated: now 
            }
          : item
      ));
      toast.success("Item updated", {
        description: "The inventory item has been updated"
      });
    } else {
      // Add new item
      const newItem: WarehouseItem = {
        id: Date.now().toString(),
        name: values.name,
        category: values.category,
        stockIn: values.stockIn,
        stockOut: values.stockOut,
        supplier: values.supplier,
        reorderPoint: values.reorderPoint,
        dateAdded: now,
        lastUpdated: now,
        allocatedStock: {}
      };
      setInventory(prev => [...prev, newItem]);
      toast.success("Item added", {
        description: "New item added to inventory"
      });
    }
    
    setIsEditDialogOpen(false);
  };

  return {
    editItem,
    isEditDialogOpen,
    setIsEditDialogOpen,
    handleAddNewItem,
    handleEditItem,
    handleDeleteItem,
    handleSaveItem
  };
}
