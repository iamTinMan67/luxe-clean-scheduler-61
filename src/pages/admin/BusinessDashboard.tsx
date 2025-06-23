
import { motion } from "framer-motion";
import DashboardContent from "@/components/dashboard/DashboardContent";
import AdminPageTitle from "@/components/admin/AdminPageTitle";
import ManualSyncButton from "@/components/admin/ManualSyncButton";

const BusinessDashboard = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container mx-auto py-12 px-4"
    >
      <div className="flex justify-between items-center mb-8">
        <AdminPageTitle 
          title="Business Dashboard" 
          subtitle="Overview of your business metrics and key performance indicators" 
        />
        <ManualSyncButton />
      </div>
      
      <DashboardContent />
    </motion.div>
  );
};

export default BusinessDashboard;
