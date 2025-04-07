import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";

// Import our new components
import InventoryOverview from "@/components/warehouse-inventory/InventoryOverview";
import InventoryFilter from "@/components/warehouse-inventory/InventoryFilter";
import InventoryTable from "@/components/warehouse-inventory/InventoryTable";
import ItemFormDialog from "@/components/warehouse-inventory/ItemFormDialog";
import AllocateStockDialog from "@/components/warehouse-inventory/AllocateStockDialog";

// Types
type InventoryItem = {
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

type Van = {
  id: string;
  registration: string;
  name: string;
};

const WarehouseInventory = () => {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [vans, setVans] = useState<Van[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [editItem, setEditItem] = useState<InventoryItem | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAllocateDialogOpen, setIsAllocateDialogOpen] = useState(false);
  const [selectedItemForAllocation, setSelectedItemForAllocation] = useState<InventoryItem | null>(null);

  useEffect(() => {
    // Try to load inventory from localStorage
    const savedInventory = localStorage.getItem('warehouseInventory');
    if (savedInventory) {
      try {
        const parsedInventory = JSON.parse(savedInventory);
        // Ensure all items have allocatedStock property
        const updatedInventory = parsedInventory.map((item: InventoryItem) => ({
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

    // Load vans from localStorage
    const savedVans = localStorage.getItem('vans');
    if (savedVans) {
      try {
        const parsedVans = JSON.parse(savedVans);
        setVans(parsedVans);
      } catch (error) {
        console.error('Error parsing vans:', error);
        // Set default vans if error
        const defaultVans = getDefaultVans();
        setVans(defaultVans);
        localStorage.setItem('vans', JSON.stringify(defaultVans));
      }
    } else {
      // Set default vans if none exists
      const defaultVans = getDefaultVans();
      setVans(defaultVans);
      localStorage.setItem('vans', JSON.stringify(defaultVans));
    }
  }, []);

  // Save to localStorage whenever inventory changes
  useEffect(() => {
    localStorage.setItem('warehouseInventory', JSON.stringify(inventory));
  }, [inventory]);

  // Save to localStorage whenever vans change
  useEffect(() => {
    localStorage.setItem('vans', JSON.stringify(vans));
  }, [vans]);

  const getDefaultInventory = (): InventoryItem[] => {
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

  const getDefaultVans = (): Van[] => {
    return [
      { id: "1", registration: "AB12 CDE", name: "Van 1" },
      { id: "2", registration: "FG34 HIJ", name: "Van 2" },
    ];
  };

  // Filter items based on search term and active tab
  const filteredItems = inventory.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        item.supplier.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (activeTab === "all") return matchesSearch;
    if (activeTab === "low") return matchesSearch && (currentStock(item)) <= item.reorderPoint && currentStock(item) > 0;
    if (activeTab === "out") return matchesSearch && (currentStock(item)) === 0;
    
    return matchesSearch;
  });

  // Calculate total allocated stock for an item
  const getTotalAllocated = (item: InventoryItem): number => {
    return Object.values(item.allocatedStock).reduce((sum, qty) => sum + qty, 0);
  };

  // Calculate current stock
  const currentStock = (item: InventoryItem) => Math.max(0, item.stockIn - item.stockOut - getTotalAllocated(item));

  const handleAddNewItem = () => {
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
      const newItem: InventoryItem = {
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
    
    setActiveTab("low");
  };

  const handleAllocateStock = (item: InventoryItem) => {
    setSelectedItemForAllocation(item);
    setIsAllocateDialogOpen(true);
  };

  const handleSaveAllocation = (values: { vanId: string; quantity: number }) => {
    if (!selectedItemForAllocation) return;
    
    const selectedVan = vans.find(van => van.id === values.vanId);
    if (!selectedVan) return;
    
    const availableStock = currentStock(selectedItemForAllocation);
    
    if (values.quantity > availableStock) {
      toast.error("Insufficient stock", {
        description: `Only ${availableStock} units available for allocation`
      });
      return;
    }
    
    setInventory(prev => prev.map(item => {
      if (item.id === selectedItemForAllocation.id) {
        const updatedAllocatedStock = { ...item.allocatedStock };
        updatedAllocatedStock[selectedVan.registration] = (updatedAllocatedStock[selectedVan.registration] || 0) + values.quantity;
        
        return {
          ...item,
          allocatedStock: updatedAllocatedStock,
          lastUpdated: new Date().toISOString().split('T')[0]
        };
      }
      return item;
    }));
    
    toast.success("Stock allocated", {
      description: `${values.quantity} units allocated to ${selectedVan.registration}`
    });
    
    setIsAllocateDialogOpen(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="container mx-auto py-8 px-4"
    >
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Warehouse Inventory</h1>
        <p className="text-gold">Manage your main warehouse stock levels</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Inventory Overview Cards */}
        <InventoryOverview 
          inventory={inventory}
          onAddNewItem={handleAddNewItem}
          onExportInventory={handleExportInventory}
          onCheckLowStock={handleCheckLowStock}
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
        onSave={handleSaveAllocation}
        currentStock={currentStock}
      />
    </motion.div>
  );
};

export default WarehouseInventory;
