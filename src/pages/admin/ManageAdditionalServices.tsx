
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import AdminPageTitle from "@/components/admin/AdminPageTitle";
import AdditionalServicesManager from "@/components/package-management/AdditionalServicesManager";

const ManageAdditionalServices = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container mx-auto py-12 px-4"
    >
      <div className="flex items-center mb-8">
        <Link 
          to="/admin/management" 
          className="flex items-center space-x-2 text-yellow-400 hover:text-yellow-300 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Management</span>
        </Link>
      </div>

      <AdminPageTitle 
        title="Manage Additional Services" 
        subtitle="Configure additional service options and pricing" 
      />
      
      <AdditionalServicesManager />
    </motion.div>
  );
};

export default ManageAdditionalServices;
