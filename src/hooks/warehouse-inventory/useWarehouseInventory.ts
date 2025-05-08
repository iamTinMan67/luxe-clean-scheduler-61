
import { useState, useEffect } from "react";
import { z } from "zod";
import { toast } from "sonner";

// Form schema for inventory item
export const warehouseItemSchema = z.object({
  name: z.string().min(1, "Name is required"),
  category: z.string().min(1, "Category is required"),
  stockIn: z.coerce.number().min(0, "Stock in must be at least 0"),
  stockOut: z.coerce.number().min(0, "Stock out must be at least 0"),
  supplier: z.string().min(1, "Supplier is required"),
  reorderPoint: z.coerce.number().min(0, "Reorder point must be at least 0"),
});

export type WarehouseItem = {
  id: string;
  name: string;
  category: string;
  stockIn: number;
  stockOut: number;
  dateAdded: string;
  lastUpdated: string;
  supplier: string;
  reorderPoint: number;
  allocatedStock: { [vanReg: string]: number };
};

export default function useWarehouseInventory() {
  const [inventory, setInventory] = useState<WarehouseItem[]>([]);
  const [editItem, setEditItem] = useState<WarehouseItem | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  // Load inventory from localStorage
  useEffect(() => {
    const savedInventory = localStorage.getItem('warehouseInventory');
    if (savedInventory) {
      try {
        const parsedInventory = JSON.parse(savedInventory);
        // Ensure all items have allocatedStock property
        const updatedInventory = parsedInventory.map((item: WarehouseItem) => ({
          ...item,
          allocatedStock: item.allocatedStock || {},
        }));
        setInventory(updatedInventory);
      } catch (error) {
        console.error('Error parsing warehouse inventory:', error);
        // Set default data if error
        setInventory(getDefaultInventory());
      }
    } else {
      // Set default data if none exists
      setInventory(getDefaultInventory());
      // Save to localStorage for future
      localStorage.setItem('warehouseInventory', JSON.stringify(getDefaultInventory()));
    }
  }, []);

  // Save to localStorage whenever inventory changes
  useEffect(() => {
    localStorage.setItem('warehouseInventory', JSON.stringify(inventory));
  }, [inventory]);

  const getDefaultInventory = (): WarehouseItem[] => {
    return [
      {
        id: "1", 
        name: "Microfiber Cloths (Pack of 50)", 
        category: "Cleaning", 
        stockIn: 100, 
        stockOut: 35, 
        dateAdded: "2023-03-15", 
        lastUpdated: "2023-05-20",
        supplier: "CleanSupplies Inc.",
        reorderPoint: 20,
        allocatedStock: {}
      },
      {
        id: "2", 
        name: "Premium Car Shampoo (5L)", 
        category: "Chemicals", 
        stockIn: 30, 
        stockOut: 12, 
        dateAdded: "2023-04-10", 
        lastUpdated: "2023-05-18",
        supplier: "AutoChem Ltd.",
        reorderPoint: 10,
        allocatedStock: {}
      },
      {
        id: "3", 
        name: "Interior Cleaner (1L)", 
        category: "Chemicals", 
        stockIn: 45, 
        stockOut: 28, 
        dateAdded: "2023-03-22", 
        lastUpdated: "2023-05-19",
        supplier: "AutoChem Ltd.",
        reorderPoint: 15,
        allocatedStock: {}
      },
      {
        id: "4", 
        name: "Tire Shine (500ml)", 
        category: "Chemicals", 
        stockIn: 50, 
        stockOut: 22, 
        dateAdded: "2023-04-05", 
        lastUpdated: "2023-05-15",
        supplier: "WheelGloss Co.",
        reorderPoint: 15,
        allocatedStock: {}
      },
      {
        id: "5", 
        name: "Detailing Brushes Set", 
        category: "Tools", 
        stockIn: 25, 
        stockOut: 18, 
        dateAdded: "2023-02-28", 
        lastUpdated: "2023-05-10",
        supplier: "DetailPro Tools",
        reorderPoint: 8,
        allocatedStock: {}
      },
      {
        id: "6", 
        name: "Clay Bar Kit", 
        category: "Detailing", 
        stockIn: 20, 
        stockOut: 15, 
        dateAdded: "2023-04-15", 
        lastUpdated: "2023-05-12",
        supplier: "SmoothSurface Inc.",
        reorderPoint: 5,
        allocatedStock: {}
      },
      {
        id: "7", 
        name: "Ceramic Coating (250ml)", 
        category: "Protection", 
        stockIn: 15, 
        stockOut: 9, 
        dateAdded: "2023-03-10", 
        lastUpdated: "2023-05-05",
        supplier: "ProCoat Systems",
        reorderPoint: 5,
        allocatedStock: {}
      },
      {
        id: "8", 
        name: "Pressure Washer Attachments", 
        category: "Equipment", 
        stockIn: 10, 
        stockOut: 4, 
        dateAdded: "2023-02-15", 
        lastUpdated: "2023-04-20",
        supplier: "WashTech Supplies",
        reorderPoint: 3,
        allocatedStock: {}
      },
    ];
  };

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

  // Calculate total allocated stock for an item
  const getTotalAllocated = (item: WarehouseItem): number => {
    return Object.values(item.allocatedStock).reduce((sum, qty) => sum + qty, 0);
  };

  // Calculate current stock
  const currentStock = (item: WarehouseItem) => Math.max(0, item.stockIn - item.stockOut - getTotalAllocated(item));

  const handleExportInventory = () => {
    toast.success("Inventory exported", {
      description: "The inventory report has been generated"
    });
  };

  const handleCheckLowStock = () => {
    const lowStockItems = inventory.filter(
      item => currentStock(item) <= item.reorderPoint && currentStock(item) > 0
    );
    
    toast.info(`${lowStockItems.length} items with low stock found`, {
      description: "Check the Low Stock tab for details"
    });
    
    return "low";  // Return the tab name to set
  };

  return {
    inventory,
    editItem,
    isEditDialogOpen,
    setIsEditDialogOpen,
    handleAddNewItem,
    handleEditItem,
    handleDeleteItem,
    handleSaveItem,
    getTotalAllocated,
    currentStock,
    handleExportInventory,
    handleCheckLowStock
  };
}
