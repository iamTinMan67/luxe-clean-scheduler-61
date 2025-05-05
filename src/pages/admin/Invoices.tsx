
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import InvoiceList from "@/components/invoices/InvoiceList";
import InvoiceSummary from "@/components/invoices/InvoiceSummary";
import { useInvoiceManagement } from "@/hooks/invoices/useInvoiceManagement";

const Invoices = () => {
  const { invoices, markAsPaid } = useInvoiceManagement();
  
  return (
    <div className="min-h-screen bg-black pb-16">
      <section className="relative py-8">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold text-white">
              Customer <span className="text-gold">Invoices</span>
            </h1>
            <p className="text-gray-400">
              View and manage all customer invoices
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="bg-gray-900 border-gray-800 p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-white">Invoices</h2>
                <InvoiceSummary invoices={invoices} />
              </div>
              
              <InvoiceList 
                invoices={invoices}
                onMarkAsPaid={markAsPaid}
              />
            </Card>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Invoices;
