
import { WarehouseItem } from "@/types/warehouseInventory";
import { getTotalAllocated, calculateCurrentStock } from "@/utils/warehouseInventoryUtils";
import useInventoryStorage from "./useInventoryStorage";
import useItemEditor from "./useItemEditor";
import useInventoryReporting from "./useInventoryReporting";

export type { WarehouseItem };
export { warehouseItemSchema } from "@/types/warehouseInventory";

export default function useWarehouseInventory() {
  // Use the separated hooks
  const { inventory, setInventory } = useInventoryStorage();
  
  const {
    editItem,
    isEditDialogOpen,
    setIsEditDialogOpen,
    handleAddNewItem,
    handleEditItem,
    handleDeleteItem,
    handleSaveItem
  } = useItemEditor(inventory, setInventory);
  
  const {
    handleExportInventory,
    handleCheckLowStock
  } = useInventoryReporting(inventory);

  // Calculate current stock
  const currentStock = (item: WarehouseItem) => calculateCurrentStock(item);

  return {
    inventory,
    setInventory,
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
