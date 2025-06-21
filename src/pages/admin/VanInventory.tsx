
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import AdminPageTitle from "@/components/admin/AdminPageTitle";
import VanOverview from "@/components/van-inventory/VanOverview";

const VanInventory = () => {
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
      
      <VanOverview />
    </motion.div>
  );
};

export default VanInventory;
