
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import AdminPageTitle from "@/components/admin/AdminPageTitle";
import InvoiceManagement from "@/components/invoices/InvoiceManagement";

const Invoices = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container mx-auto py-12 px-4"
    >
      <div className="flex items-center mb-8">
        <Link 
          to="/admin/dashboard" 
          className="flex items-center space-x-2 text-yellow-400 hover:text-yellow-300 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Dashboard</span>
        </Link>
      </div>

      <AdminPageTitle 
        title="Invoice Management" 
        subtitle="Manage billing and payments" 
      />
      
      <InvoiceManagement />
    </motion.div>
  );
};

export default Invoices;
