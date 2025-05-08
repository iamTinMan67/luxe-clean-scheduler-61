
import { useState, useEffect } from "react";
import { WarehouseItem } from "@/types/warehouseInventory";
import { getDefaultInventory } from "@/utils/warehouseInventoryUtils";

export default function useInventoryStorage() {
  const [inventory, setInventory] = useState<WarehouseItem[]>([]);

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

  return {
    inventory,
    setInventory
  };
}
