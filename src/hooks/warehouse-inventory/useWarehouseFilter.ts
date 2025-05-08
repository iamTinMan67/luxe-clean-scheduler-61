
import { useState } from "react";
import { WarehouseItem } from "./useWarehouseInventory";

export default function useWarehouseFilter() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const filterItems = (
    inventory: WarehouseItem[], 
    currentStock: (item: WarehouseItem) => number
  ) => {
    return inventory.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.supplier.toLowerCase().includes(searchTerm.toLowerCase());
      
      if (activeTab === "all") return matchesSearch;
      if (activeTab === "low") return matchesSearch && (currentStock(item)) <= item.reorderPoint && currentStock(item) > 0;
      if (activeTab === "out") return matchesSearch && (currentStock(item)) === 0;
      
      return matchesSearch;
    });
  };

  return {
    searchTerm,
    setSearchTerm,
    activeTab,
    setActiveTab,
    filterItems
  };
}
