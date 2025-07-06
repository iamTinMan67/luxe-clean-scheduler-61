
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import AdminPageTitle from "@/components/admin/AdminPageTitle";
import VanOverview from "@/components/van-inventory/VanOverview";

const VanInventory = () => {
  // Enhanced mock data for van inventory with proper structure
  const mockInventory = [
    {
      id: "1",
      name: "Microfiber Cloths",
      category: "cleaning",
      quantity: 15,
      minLevel: 10,
      lastRestocked: "2024-01-10",
      vanId: "van-001",
      unit: "units",
      threshold: 5
    },
    {
      id: "2",
      name: "Car Soap - Premium",
      category: "chemicals",
      quantity: 3,
      minLevel: 5,
      lastRestocked: "2024-01-08",
      vanId: "van-001",
      unit: "bottles",
      threshold: 3
    },
    {
      id: "3",
      name: "Tire Shine Spray",
      category: "chemicals",
      quantity: 8,
      minLevel: 6,
      lastRestocked: "2024-01-12",
      vanId: "van-001",
      unit: "bottles",
      threshold: 4
    },
    {
      id: "4",
      name: "Interior Vacuum Bags",
      category: "equipment",
      quantity: 12,
      minLevel: 8,
      lastRestocked: "2024-01-05",
      vanId: "van-001",
      unit: "pieces",
      threshold: 5
    },
    {
      id: "5",
      name: "Glass Cleaner",
      category: "chemicals",
      quantity: 6,
      minLevel: 4,
      lastRestocked: "2024-01-11",
      vanId: "van-001",
      unit: "bottles",
      threshold: 3
    }
  ];

  const handleRestockRequest = () => {
    console.log("Restock request submitted");
    // This would typically trigger a notification or API call
  };

  const handleAddItem = () => {
    console.log("Add new item to van inventory");
    // This would open a dialog to add new inventory items
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
        title="Van Inventory" 
        subtitle="Manage mobile equipment and supplies" 
      />
      
      <VanOverview 
        vanRegistration="VAN-001"
        inventory={mockInventory}
        activeVanId="van-001"
        onRestockRequest={handleRestockRequest}
        onAddItem={handleAddItem}
      />
    </motion.div>
  );
};

export default VanInventory;
