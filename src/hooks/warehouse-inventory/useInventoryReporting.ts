
import { toast } from "sonner";
import { WarehouseItem } from "@/types/warehouseInventory";
import { checkLowStock, calculateCurrentStock } from "@/utils/warehouseInventoryUtils";

export default function useInventoryReporting(inventory: WarehouseItem[]) {
  const handleExportInventory = () => {
    toast.success("Inventory exported", {
      description: "The inventory report has been generated"
    });
  };

  const handleCheckLowStock = () => {
    const lowStockCount = checkLowStock(inventory, calculateCurrentStock);
    
    toast.info(`${lowStockCount} items with low stock found`, {
      description: "Check the Low Stock tab for details"
    });
    
    return "low";  // Return the tab name to set
  };

  return {
    handleExportInventory,
    handleCheckLowStock
  };
}
