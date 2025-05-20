
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";

// Import our custom hooks
import useWarehouseInventory, { WarehouseItem } from "@/hooks/warehouse-inventory/useWarehouseInventory";
import useAllocationManager from "@/hooks/warehouse-inventory/useAllocationManager";
import useWarehouseFilter from "@/hooks/warehouse-inventory/useWarehouseFilter";
import useVansLoader from "@/hooks/warehouse-inventory/useVansLoader";

// Import our components
import InventoryOverview from "@/components/warehouse-inventory/InventoryOverview";
import InventoryFilter from "@/components/warehouse-inventory/InventoryFilter";
import InventoryTable from "@/components/warehouse-inventory/InventoryTable";
import ItemFormDialog from "@/components/warehouse-inventory/ItemFormDialog";
import AllocateStockDialog from "@/components/warehouse-inventory/AllocateStockDialog";

const WarehouseInventory = () => {
  // Use our custom hooks for state management
  const {
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
  } = useWarehouseInventory();

  // Load vans
  const { vans } = useVansLoader();

  // Handle allocation of stock to vans
  const {
    isAllocateDialogOpen,
    setIsAllocateDialogOpen,
    selectedItemForAllocation,
    handleAllocateStock,
    handleSaveAllocation
  } = useAllocationManager(inventory, setInventory);

  // Filter items
  const {
    searchTerm,
    setSearchTerm,
    activeTab,
    setActiveTab,
    filterItems
  } = useWarehouseFilter();

  // Get filtered items
  const filteredItems = filterItems(inventory, currentStock);

  // Handle checking low stock
  const onCheckLowStock = () => {
    const tabToSet = handleCheckLowStock();
    setActiveTab(tabToSet);
  };

  // Handle allocation
  const onSaveAllocation = (values: { vanId: string; quantity: number }) => {
    handleSaveAllocation(values, currentStock, vans);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="container mx-auto py-8 px-4"
    >
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-white mb-2">Warehouse Inventory</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Inventory Overview Cards */}
        <InventoryOverview 
          inventory={inventory}
          onAddNewItem={handleAddNewItem}
          onExportInventory={handleExportInventory}
          onCheckLowStock={onCheckLowStock}
        />
        
        <div className="lg:col-span-3">
          <Card className="bg-black/60 border-gold/30">
            {/* Search and Filters */}
            <InventoryFilter 
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />
            
            <CardContent>
              {/* Inventory Table */}
              <InventoryTable 
                items={filteredItems}
                onEditItem={handleEditItem}
                onDeleteItem={handleDeleteItem}
                onAllocateStock={handleAllocateStock}
              />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Dialog for adding/editing items */}
      <ItemFormDialog 
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        editItem={editItem}
        onSave={handleSaveItem}
      />

      {/* Dialog for allocating stock to van */}
      <AllocateStockDialog 
        open={isAllocateDialogOpen}
        onOpenChange={setIsAllocateDialogOpen}
        item={selectedItemForAllocation}
        vans={vans}
        onSave={onSaveAllocation}
        currentStock={currentStock}
      />
    </motion.div>
  );
};

export default WarehouseInventory;
