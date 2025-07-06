
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import AdminPageTitle from "@/components/admin/AdminPageTitle";
import InventoryOverview from "@/components/warehouse-inventory/InventoryOverview";

const WarehouseInventory = () => {
  // Enhanced mock data for warehouse inventory with comprehensive stock listings
  const mockInventory = [
    {
      id: "1",
      name: "Premium Car Wax - Carnauba",
      category: "chemicals",
      stockIn: 50,
      stockOut: 10,
      dateAdded: "2024-01-01",
      lastUpdated: "2024-01-15",
      supplier: "AutoCare Supplies Ltd",
      reorderPoint: 15,
      allocatedStock: { "VAN-001": 5, "VAN-002": 3, "VAN-003": 2 }
    },
    {
      id: "2",
      name: "Microfiber Towels - Professional Grade",
      category: "cleaning",
      stockIn: 100,
      stockOut: 25,
      dateAdded: "2024-01-01",
      lastUpdated: "2024-01-14",
      supplier: "Cleaning Solutions Ltd",
      reorderPoint: 20,
      allocatedStock: { "VAN-001": 10, "VAN-002": 8, "VAN-003": 7 }
    },
    {
      id: "3",
      name: "Tire Shine - Silicone Based",
      category: "chemicals",
      stockIn: 75,
      stockOut: 18,
      dateAdded: "2024-01-02",
      lastUpdated: "2024-01-13",
      supplier: "Premium Auto Products",
      reorderPoint: 12,
      allocatedStock: { "VAN-001": 6, "VAN-002": 7, "VAN-003": 5 }
    },
    {
      id: "4",
      name: "Interior Cleaner - All Purpose",
      category: "chemicals",
      stockIn: 60,
      stockOut: 22,
      dateAdded: "2024-01-03",
      lastUpdated: "2024-01-12",
      supplier: "AutoCare Supplies Ltd",
      reorderPoint: 18,
      allocatedStock: { "VAN-001": 8, "VAN-002": 9, "VAN-003": 5 }
    },
    {
      id: "5",
      name: "Chamois Cloths - Natural",
      category: "cleaning",
      stockIn: 40,
      stockOut: 15,
      dateAdded: "2024-01-04",
      lastUpdated: "2024-01-11",
      supplier: "Cleaning Solutions Ltd",
      reorderPoint: 10,
      allocatedStock: { "VAN-001": 5, "VAN-002": 5, "VAN-003": 5 }
    },
    {
      id: "6",
      name: "Glass Cleaner - Streak Free",
      category: "chemicals",
      stockIn: 80,
      stockOut: 30,
      dateAdded: "2024-01-05",
      lastUpdated: "2024-01-10",
      supplier: "Premium Auto Products",
      reorderPoint: 25,
      allocatedStock: { "VAN-001": 10, "VAN-002": 12, "VAN-003": 8 }
    },
    {
      id: "7",
      name: "Wheel Cleaning Brushes",
      category: "equipment",
      stockIn: 30,
      stockOut: 8,
      dateAdded: "2024-01-06",
      lastUpdated: "2024-01-09",
      supplier: "Tool Supply Co",
      reorderPoint: 5,
      allocatedStock: { "VAN-001": 3, "VAN-002": 3, "VAN-003": 2 }
    },
    {
      id: "8",
      name: "Vacuum Cleaner Bags - Heavy Duty",
      category: "equipment",
      stockIn: 120,
      stockOut: 35,
      dateAdded: "2024-01-07",
      lastUpdated: "2024-01-08",
      supplier: "Equipment Plus",
      reorderPoint: 40,
      allocatedStock: { "VAN-001": 12, "VAN-002": 15, "VAN-003": 8 }
    }
  ];

  const handleAddNewItem = () => {
    console.log("Add new warehouse inventory item");
    // This would open a dialog to add new inventory items
  };

  const handleExportInventory = () => {
    console.log("Export inventory report");
    // This would generate and download an inventory report
  };

  const handleCheckLowStock = () => {
    console.log("Check low stock items");
    // This would filter and highlight low stock items
    const lowStockItems = mockInventory.filter(item => 
      (item.stockIn - item.stockOut) <= item.reorderPoint
    );
    console.log("Low stock items found:", lowStockItems.length);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container mx-auto py-12 px-4"
    >
      <div className="flex items-center mb-8">
        <Link 
          to="/admin/inventory" 
          className="flex items-center space-x-2 text-yellow-400 hover:text-yellow-300 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Inventory</span>
        </Link>
      </div>

      <AdminPageTitle 
        title="Warehouse Inventory" 
        subtitle="Manage warehouse stock and supplies" 
      />
      
      <InventoryOverview 
        inventory={mockInventory}
        onAddNewItem={handleAddNewItem}
        onExportInventory={handleExportInventory}
        onCheckLowStock={handleCheckLowStock}
      />
    </motion.div>
  );
};

export default WarehouseInventory;
