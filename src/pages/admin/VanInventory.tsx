
import { motion } from "framer-motion";
import { z } from "zod";

// Import refactored hooks
import useVans, { vanSchema } from "@/hooks/van-inventory/useVans";
import useInventoryItems, { inventoryItemSchema } from "@/hooks/van-inventory/useInventoryItems";
import useInventoryFilter from "@/hooks/van-inventory/useInventoryFilter";

// Import UI components
import VanSelector from "@/components/van-inventory/VanSelector";
import VanOverview from "@/components/van-inventory/VanOverview";
import InventoryList from "@/components/van-inventory/InventoryList";
import ItemFormDialog from "@/components/van-inventory/ItemFormDialog";
import VanFormDialog from "@/components/van-inventory/VanFormDialog";

const VanInventory = () => {
  // Use our custom hooks for state management
  const {
    vans,
    activeVanId,
    setActiveVanId,
    editVan,
    isVanDialogOpen,
    setIsVanDialogOpen,
    handleAddVan,
    handleEditVan,
    handleDeleteVan,
    handleSaveVan
  } = useVans();

  const {
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
  } = useInventoryItems(activeVanId);

  const {
    searchTerm,
    setSearchTerm,
    filterInventoryItems
  } = useInventoryFilter();

  // Filter items based on search term and active van
  const filteredItems = filterInventoryItems(inventory, activeVanId);

  // Get current van
  const currentVan = vans.find(van => van.id === activeVanId) || { id: "", registration: "", name: "" };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="container mx-auto py-8 px-4"
    >
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-white mb-2">Van Inventory</h1>
      </div>

      {/* Van selection tabs */}
      <VanSelector
        vans={vans}
        activeVanId={activeVanId}
        onVanChange={setActiveVanId}
        onAddVan={handleAddVan}
        onEditVan={handleEditVan}
        onDeleteVan={handleDeleteVan}
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <VanOverview
            vanRegistration={currentVan.registration}
            inventory={inventory}
            activeVanId={activeVanId}
            onRestockRequest={handleRestockRequest}
            onAddItem={handleAddItem}
          />
        </div>
        
        <div className="lg:col-span-3">
          <InventoryList
            items={filteredItems}
            vanName={currentVan.name}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            onAdjustQuantity={(id, amount) => adjustQuantity(id, amount, vans)}
            onEditItem={handleEditItem}
            onDeleteItem={handleDeleteItem}
          />
        </div>
      </div>

      {/* Dialog for adding/editing items */}
      <ItemFormDialog
        isOpen={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onSave={handleSaveItem}
        editItem={editItem}
        vans={vans}
        activeVanId={activeVanId}
      />

      {/* Dialog for adding/editing vans */}
      <VanFormDialog
        isOpen={isVanDialogOpen}
        onOpenChange={setIsVanDialogOpen}
        onSave={handleSaveVan}
        editVan={editVan}
      />
    </motion.div>
  );
};

export default VanInventory;
