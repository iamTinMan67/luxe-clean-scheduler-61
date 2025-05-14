
import { motion } from "framer-motion";
import FinancialSummary from "@/components/invoices/FinancialSummary";
import QuickActions from "@/components/invoices/QuickActions";
import StaffAssignment from "@/components/invoices/StaffAssignment";
import InvoiceManagement from "@/components/invoices/InvoiceManagement";
import { useInvoiceReport } from "@/hooks/useInvoiceReport";

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
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Invoice Reports</h1>
        <p className="text-gold">Track payments and manage customer invoices</p>
      </div>

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
