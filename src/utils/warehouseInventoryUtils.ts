
import { WarehouseItem } from "@/types/warehouseInventory";
import { supabase } from "@/integrations/supabase/client";

// Calculate total allocated stock for an item
export const getTotalAllocated = (item: WarehouseItem): number => {
  return Object.values(item.allocatedStock).reduce((sum, qty) => sum + qty, 0);
};

// Calculate current stock
export const calculateCurrentStock = (item: WarehouseItem) => {
  return Math.max(0, item.stockIn - item.stockOut - getTotalAllocated(item));
};

// Get default warehouse inventory data
export const getDefaultInventory = (): WarehouseItem[] => {
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

// Handle checking for low stock items
export const checkLowStock = (inventory: WarehouseItem[], currentStockFn: (item: WarehouseItem) => number) => {
  const lowStockItems = inventory.filter(
    item => currentStockFn(item) <= item.reorderPoint && currentStockFn(item) > 0
  );
  
  return lowStockItems.length;
};

// Sync a single inventory item with Supabase
export const syncInventoryItem = async (item: WarehouseItem): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from("inventory_items")
      .upsert({
        id: item.id,
        name: item.name,
        category: item.category,
        stock_in: item.stockIn,
        stock_out: item.stockOut,
        supplier: item.supplier,
        reorder_point: item.reorderPoint,
        allocated_stock: item.allocatedStock || {},
        location: "Warehouse",
        updated_at: new Date().toISOString()
      }, 
      { onConflict: 'id' });
      
    return !error;
  } catch (error) {
    console.error("Error syncing inventory item:", error);
    return false;
  }
};

// Sync all inventory items with Supabase
export const syncAllInventory = async (inventory: WarehouseItem[]): Promise<boolean> => {
  try {
    const items = inventory.map(item => ({
      id: item.id,
      name: item.name,
      category: item.category,
      stock_in: item.stockIn,
      stock_out: item.stockOut,
      supplier: item.supplier,
      reorder_point: item.reorderPoint,
      allocated_stock: item.allocatedStock || {},
      location: "Warehouse",
      updated_at: new Date().toISOString(),
      created_at: new Date(item.dateAdded).toISOString()
    }));
    
    const { error } = await supabase
      .from("inventory_items")
      .upsert(items, { onConflict: 'id' });
      
    return !error;
  } catch (error) {
    console.error("Error syncing all inventory:", error);
    return false;
  }
};
