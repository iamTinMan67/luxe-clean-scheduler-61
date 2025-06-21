
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft, Plus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import InvoiceListWithDatabase from "@/components/invoices/InvoiceListWithDatabase";
import CreateInvoiceForm from "@/components/invoices/CreateInvoiceForm";
import InvoiceSummary from "@/components/invoices/InvoiceSummary";
import AdminPageTitle from "@/components/admin/AdminPageTitle";

const Invoices = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleInvoiceCreated = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-black pb-16">
      <section className="relative py-8">
        <div className="container mx-auto px-4">
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
            title="Customer" 
            subtitle="View and manage all customer invoices" 
          >
            <span className="text-gold">Invoices</span>
          </AdminPageTitle>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="bg-gray-900 border-gray-800 p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-white">Invoices</h2>
                <div className="flex items-center space-x-4">
                  <InvoiceSummary key={refreshKey} />
                  <Button 
                    onClick={() => setShowCreateForm(true)}
                    className="bg-gold hover:bg-gold/80 text-black"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create Invoice
                  </Button>
                </div>
              </div>
              
              <InvoiceListWithDatabase 
                key={refreshKey}
                onInvoiceUpdate={handleInvoiceCreated}
              />
            </Card>
          </motion.div>
        </div>
      </section>

      <CreateInvoiceForm 
        open={showCreateForm}
        onOpenChange={setShowCreateForm}
        onInvoiceCreated={handleInvoiceCreated}
      />
    </div>
  );
};

export default Invoices;
