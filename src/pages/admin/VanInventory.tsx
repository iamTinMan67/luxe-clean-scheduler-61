
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { z } from "zod";

// Import refactored components
import VanSelector from "@/components/van-inventory/VanSelector";
import VanOverview from "@/components/van-inventory/VanOverview";
import InventoryList from "@/components/van-inventory/InventoryList";
import ItemFormDialog from "@/components/van-inventory/ItemFormDialog";
import VanFormDialog from "@/components/van-inventory/VanFormDialog";

// Types
type InventoryItem = {
  id: string;
  name: string;
  category: string;
  quantity: number;
  minLevel: number;
  lastRestocked: string;
  vanId: string;
};

type Van = {
  id: string;
  registration: string;
  name: string;
};

// Form schema for inventory item
const inventoryItemSchema = z.object({
  name: z.string().min(1, "Name is required"),
  category: z.string().min(1, "Category is required"),
  quantity: z.coerce.number().min(0, "Quantity must be at least 0"),
  minLevel: z.coerce.number().min(0, "Minimum level must be at least 0"),
  vanId: z.string().min(1, "Van is required"),
});

// Form schema for van
const vanSchema = z.object({
  registration: z.string().min(1, "Registration is required"),
  name: z.string().min(1, "Name is required"),
});

const VanInventory = () => {
  // States
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [vans, setVans] = useState<Van[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeVanId, setActiveVanId] = useState<string>("");
  const [editItem, setEditItem] = useState<InventoryItem | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isVanDialogOpen, setIsVanDialogOpen] = useState(false);
  const [editVan, setEditVan] = useState<Van | null>(null);

  useEffect(() => {
    // Try to load inventory from localStorage
    const savedInventory = localStorage.getItem('vanInventory');
    if (savedInventory) {
      try {
        const parsedInventory = JSON.parse(savedInventory);
        // Update structure if missing vanId
        const updatedInventory = parsedInventory.map((item: InventoryItem) => ({
          ...item,
          vanId: item.vanId || "1", // Default to first van if none specified
        }));
        setInventory(updatedInventory);
      } catch (error) {
        console.error('Error parsing van inventory:', error);
        // Set default data if error
        setInventory(getDefaultInventory());
      }
    } else {
      // Set default data if none exists
      setInventory(getDefaultInventory());
      // Save to localStorage for future
      localStorage.setItem('vanInventory', JSON.stringify(getDefaultInventory()));
    }

    // Load vans from localStorage
    const savedVans = localStorage.getItem('vans');
    if (savedVans) {
      try {
        const parsedVans = JSON.parse(savedVans);
        setVans(parsedVans);
        // Set active van to first one if it exists
        if (parsedVans.length > 0 && !activeVanId) {
          setActiveVanId(parsedVans[0].id);
        }
      } catch (error) {
        console.error('Error parsing vans:', error);
        // Set default vans if error
        const defaultVans = getDefaultVans();
        setVans(defaultVans);
        setActiveVanId(defaultVans[0].id);
        localStorage.setItem('vans', JSON.stringify(defaultVans));
      }
    } else {
      // Set default vans if none exists
      const defaultVans = getDefaultVans();
      setVans(defaultVans);
      setActiveVanId(defaultVans[0].id);
      localStorage.setItem('vans', JSON.stringify(defaultVans));
    }
  }, []);

  // Set active van if not set yet
  useEffect(() => {
    if (vans.length > 0 && !activeVanId) {
      setActiveVanId(vans[0].id);
    }
  }, [vans, activeVanId]);

  // Save to localStorage whenever inventory changes
  useEffect(() => {
    localStorage.setItem('vanInventory', JSON.stringify(inventory));
  }, [inventory]);

  // Save to localStorage whenever vans change
  useEffect(() => {
    localStorage.setItem('vans', JSON.stringify(vans));
  }, [vans]);

  const getDefaultInventory = (): InventoryItem[] => {
    return [
      { id: "1", name: "Microfiber Cloths", category: "Cleaning", quantity: 24, minLevel: 10, lastRestocked: "2023-05-15", vanId: "1" },
      { id: "2", name: "Interior Cleaner", category: "Chemicals", quantity: 3, minLevel: 2, lastRestocked: "2023-05-10", vanId: "1" },
      { id: "3", name: "Glass Cleaner", category: "Chemicals", quantity: 2, minLevel: 2, lastRestocked: "2023-05-10", vanId: "1" },
      { id: "4", name: "Tire Shine", category: "Chemicals", quantity: 1, minLevel: 1, lastRestocked: "2023-05-01", vanId: "1" },
      { id: "5", name: "Detailing Brushes", category: "Tools", quantity: 8, minLevel: 5, lastRestocked: "2023-04-28", vanId: "1" },
      { id: "6", name: "Pressure Washer", category: "Equipment", quantity: 1, minLevel: 1, lastRestocked: "2023-03-15", vanId: "1" },
      { id: "7", name: "Vacuum Cleaner", category: "Equipment", quantity: 1, minLevel: 1, lastRestocked: "2023-03-15", vanId: "1" },
      { id: "8", name: "Wax", category: "Chemicals", quantity: 2, minLevel: 1, lastRestocked: "2023-05-05", vanId: "1" },
      { id: "9", name: "Microfiber Cloths", category: "Cleaning", quantity: 18, minLevel: 8, lastRestocked: "2023-05-12", vanId: "2" },
      { id: "10", name: "Interior Cleaner", category: "Chemicals", quantity: 2, minLevel: 1, lastRestocked: "2023-05-08", vanId: "2" },
      { id: "11", name: "Tire Shine", category: "Chemicals", quantity: 1, minLevel: 1, lastRestocked: "2023-05-03", vanId: "2" },
    ];
  };

  const getDefaultVans = (): Van[] => {
    return [
      { id: "1", registration: "AB12 CDE", name: "Van 1" },
      { id: "2", registration: "FG34 HIJ", name: "Van 2" },
    ];
  };

  // Filter items based on search term and active van
  const filteredItems = inventory.filter(item => 
    item.vanId === activeVanId && (
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // Handle quantity change
  const adjustQuantity = (id: string, amount: number) => {
    setInventory(prev => prev.map(item => {
      if (item.id === id) {
        const newQuantity = Math.max(0, item.quantity + amount);
        
        return { 
          ...item, 
          quantity: newQuantity,
          lastRestocked: amount > 0 ? new Date().toISOString().split('T')[0] : item.lastRestocked 
        };
      }
      return item;
    }));
    
    // Update warehouse allocated stock when van inventory changes
    if (amount !== 0) {
      // Try to clear allocations from the updated van
      try {
        const warehouseInventory = localStorage.getItem('warehouseInventory');
        if (warehouseInventory) {
          const parsedInventory = JSON.parse(warehouseInventory);
          const currentVan = vans.find(van => van.id === activeVanId);
          
          if (currentVan) {
            const updatedWarehouseInventory = parsedInventory.map((item: any) => {
              if (item.allocatedStock && item.allocatedStock[currentVan.registration]) {
                const updatedAllocatedStock = { ...item.allocatedStock };
                // Clear the allocation for this van
                updatedAllocatedStock[currentVan.registration] = 0;
                return {
                  ...item,
                  allocatedStock: updatedAllocatedStock,
                  lastUpdated: new Date().toISOString().split('T')[0]
                };
              }
              return item;
            });
            
            localStorage.setItem('warehouseInventory', JSON.stringify(updatedWarehouseInventory));
          }
        }
      } catch (error) {
        console.error('Error updating warehouse allocations:', error);
      }
    }
    
    toast.success(`Inventory quantity updated`, {
      description: amount > 0 ? "Item quantity increased" : "Item quantity decreased"
    });
  };

  const handleRestockRequest = () => {
    // Find low stock items
    const lowStockItems = inventory.filter(item => item.vanId === activeVanId && item.quantity <= item.minLevel);
    
    if (lowStockItems.length > 0) {
      toast.success(`Restock request sent for ${lowStockItems.length} items`, {
        description: "The warehouse will process your request soon"
      });
    } else {
      toast.info("No items need restocking at this time");
    }
  };

  const handleAddItem = () => {
    setEditItem(null);
    setIsEditDialogOpen(true);
  };

  const handleEditItem = (item: InventoryItem) => {
    setEditItem(item);
    setIsEditDialogOpen(true);
  };

  const handleDeleteItem = (id: string) => {
    setInventory(prev => prev.filter(item => item.id !== id));
    toast.success("Item deleted", {
      description: "The inventory item has been removed"
    });
  };

  const handleSaveItem = (values: z.infer<typeof inventoryItemSchema>) => {
    if (editItem) {
      // Update existing item
      setInventory(prev => prev.map(item => 
        item.id === editItem.id 
          ? { 
              ...item, 
              ...values, 
              lastRestocked: values.quantity > item.quantity 
                ? new Date().toISOString().split('T')[0] 
                : item.lastRestocked 
            }
          : item
      ));
      toast.success("Item updated", {
        description: "The inventory item has been updated"
      });
    } else {
      // Add new item - FIX: Ensure all required properties are provided
      const newItem: InventoryItem = {
        id: Date.now().toString(),
        name: values.name,
        category: values.category,
        quantity: values.quantity,
        minLevel: values.minLevel,
        vanId: values.vanId,
        lastRestocked: new Date().toISOString().split('T')[0]
      };
      setInventory(prev => [...prev, newItem]);
      toast.success("Item added", {
        description: "New item added to van inventory"
      });
    }
    
    setIsEditDialogOpen(false);
  };

  const handleAddVan = () => {
    setEditVan(null);
    setIsVanDialogOpen(true);
  };

  const handleEditVan = (van: Van) => {
    setEditVan(van);
    setIsVanDialogOpen(true);
  };

  const handleDeleteVan = (id: string) => {
    if (vans.length <= 1) {
      toast.error("Cannot delete the only van", {
        description: "You must have at least one van in the system"
      });
      return;
    }
    
    // Delete van and its inventory
    setVans(prev => prev.filter(van => van.id !== id));
    setInventory(prev => prev.filter(item => item.vanId !== id));
    
    // If active van is deleted, set active van to first available
    if (activeVanId === id && vans.length > 1) {
      const remainingVans = vans.filter(van => van.id !== id);
      if (remainingVans.length > 0) {
        setActiveVanId(remainingVans[0].id);
      }
    }
    
    toast.success("Van deleted", {
      description: "The van and its inventory have been removed"
    });
  };

  const handleSaveVan = (values: z.infer<typeof vanSchema>) => {
    if (editVan) {
      // Update existing van
      setVans(prev => prev.map(van => 
        van.id === editVan.id 
          ? { ...van, ...values }
          : van
      ));
      toast.success("Van updated", {
        description: "The van details have been updated"
      });
    } else {
      // Add new van - FIX: Ensure all required properties are provided
      const newVan: Van = {
        id: Date.now().toString(),
        registration: values.registration,
        name: values.name
      };
      setVans(prev => [...prev, newVan]);
      
      // Set as active van if it's the first one
      if (vans.length === 0) {
        setActiveVanId(newVan.id);
      }
      
      toast.success("Van added", {
        description: "New van added to the system"
      });
    }
    
    setIsVanDialogOpen(false);
  };

  // Get current van
  const currentVan = vans.find(van => van.id === activeVanId) || { id: "", registration: "", name: "" };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="container mx-auto py-8 px-4"
    >
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Van Inventory</h1>
        <p className="text-gold">Manage your mobile service vehicle inventory</p>
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
            onAdjustQuantity={adjustQuantity}
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
