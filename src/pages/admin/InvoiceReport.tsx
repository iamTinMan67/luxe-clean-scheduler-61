
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import FinancialSummary from "@/components/invoices/FinancialSummary";
import QuickActions from "@/components/invoices/QuickActions";
import StaffAssignment from "@/components/invoices/StaffAssignment";
import InvoiceManagement from "@/components/invoices/InvoiceManagement";
import { useInvoiceReport } from "@/hooks/useInvoiceReport";
import AdminPageTitle from "@/components/admin/AdminPageTitle";

const InvoiceReport = () => {
  const {
    invoices,
    filteredInvoices,
    searchTerm,
    setSearchTerm,
    activeTab,
    setActiveTab,
    selectedStaff,
    setSelectedStaff,
    totals,
    formatCurrency
  } = useInvoiceReport();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="container mx-auto py-8 px-4"
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
        title="Invoice Reports" 
        subtitle="Track payments and manage customer invoices" 
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <FinancialSummary 
            totals={totals} 
            formatCurrency={formatCurrency} 
            invoices={invoices} 
          />
          <QuickActions />
          <StaffAssignment 
            selectedStaff={selectedStaff} 
            setSelectedStaff={setSelectedStaff} 
          />
        </div>
        
        <div className="lg:col-span-3">
          <InvoiceManagement 
            invoices={filteredInvoices}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            formatCurrency={formatCurrency}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default InvoiceReport;
