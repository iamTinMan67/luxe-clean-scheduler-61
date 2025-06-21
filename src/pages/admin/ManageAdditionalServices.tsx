
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import AdminPageTitle from "@/components/admin/AdminPageTitle";
import AdditionalServicesManager from "@/components/package-management/AdditionalServicesManager";

const ManageAdditionalServices = () => {
  // Mock data to satisfy the required props
  const mockServices = [
    { id: "1", name: "Interior Deep Clean", price: 25, description: "Comprehensive interior cleaning", duration: 30 },
    { id: "2", name: "Engine Bay Clean", price: 15, description: "Engine compartment cleaning", duration: 20 },
    { id: "3", name: "Wheel Arch Clean", price: 10, description: "Thorough wheel arch cleaning", duration: 15 }
  ];

  const handleSelectService = (service: any) => {
    console.log("Selected service:", service);
  };

  const handleSaveService = (service: any) => {
    console.log("Saved service:", service);
  };

  const handleDeleteService = (serviceId: string) => {
    console.log("Deleted service:", serviceId);
  };

  const handleUpdateServiceDuration = (serviceId: string, duration: number) => {
    console.log("Updated service duration:", serviceId, duration);
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
      
      <AdditionalServicesManager 
        services={mockServices}
        selectedService={null}
        onSelectService={handleSelectService}
        onSaveService={handleSaveService}
        onDeleteService={handleDeleteService}
        onUpdateServiceDuration={handleUpdateServiceDuration}
      />
    </motion.div>
  );
};

export default ManageAdditionalServices;
