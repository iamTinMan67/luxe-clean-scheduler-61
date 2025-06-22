
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AdminPageTitle from "@/components/admin/AdminPageTitle";
import InvoiceListWithDatabase from "@/components/invoices/InvoiceListWithDatabase";
import CreateInvoiceFormDialog from "@/components/invoices/CreateInvoiceFormDialog";
import PendingInvoicesList from "@/components/invoices/PendingInvoicesList";
import { useInvoiceDatabase } from "@/hooks/invoices/useInvoiceDatabase";
import { useState } from "react";

const Invoices = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const { invoices, loading } = useInvoiceDatabase();

  const handleInvoiceCreated = () => {
    setShowCreateForm(false);
    setRefreshTrigger(prev => prev + 1);
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
          to="/admin/dashboard" 
          className="flex items-center space-x-2 text-yellow-400 hover:text-yellow-300 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Dashboard</span>
        </Link>
      </div>

      {/* Pending Invoices Section - Above navigation buttons */}
      <PendingInvoicesList invoices={invoices} loading={loading} />

      <div className="flex justify-between items-center mb-8">
        <AdminPageTitle 
          title="Invoice Management" 
          subtitle="Create, view, and manage customer invoices" 
        />
        
        <Button 
          onClick={() => setShowCreateForm(true)}
          className="bg-yellow-600 hover:bg-yellow-700 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Invoice
        </Button>
      </div>

      <CreateInvoiceFormDialog 
        open={showCreateForm}
        onOpenChange={setShowCreateForm}
        onInvoiceCreated={handleInvoiceCreated}
      />
      
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">All Invoices</CardTitle>
        </CardHeader>
        <CardContent>
          <InvoiceListWithDatabase 
            key={refreshTrigger}
            onInvoiceUpdate={() => setRefreshTrigger(prev => prev + 1)} 
          />
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default Invoices;
