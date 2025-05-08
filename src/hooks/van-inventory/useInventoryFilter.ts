
import { useState } from "react";
import { InventoryItem } from "@/types/vanInventory";

export default function useInventoryFilter() {
  const [searchTerm, setSearchTerm] = useState("");

  const filterInventoryItems = (items: InventoryItem[], activeVanId: string) => {
    return items.filter(item => 
      item.vanId === activeVanId && (
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  };

  return {
    searchTerm,
    setSearchTerm,
    filterInventoryItems
  };
}
