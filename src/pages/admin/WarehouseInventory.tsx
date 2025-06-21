
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import AdminPageTitle from "@/components/admin/AdminPageTitle";
import InventoryOverview from "@/components/warehouse-inventory/InventoryOverview";

const WarehouseInventory = () => {
  // Mock data for warehouse inventory
  const mockInventory = [
    {
      id: "1",
      name: "Premium Car Wax",
      category: "chemicals",
      stockIn: 50,
      stockOut: 10,
      dateAdded: "2024-01-01",
      lastUpdated: "2024-01-15",
      supplier: "AutoCare Supplies",
      reorderPoint: 15,
      allocatedStock: { "VAN-001": 5, "VAN-002": 3 }
    },
    {
      id: "2",
      name: "Microfiber Towels",
      category: "cleaning",
      stockIn: 100,
      stockOut: 25,
      dateAdded: "2024-01-01",
      lastUpdated: "2024-01-14",
      supplier: "Cleaning Solutions Ltd",
      reorderPoint: 20,
      allocatedStock: { "VAN-001": 10, "VAN-002": 8 }
    }
  ];

  const handleAddNewItem = () => {
    console.log("Add new inventory item");
  };

  const handleExportInventory = () => {
    console.log("Export inventory report");
  };

  const handleCheckLowStock = () => {
    console.log("Check low stock items");
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
