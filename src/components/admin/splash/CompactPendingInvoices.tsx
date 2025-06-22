
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { DollarSign, Calendar, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useInvoiceDatabase } from "@/hooks/invoices/useInvoiceDatabase";

const CompactPendingInvoices = () => {
  const { invoices, loading } = useInvoiceDatabase();
  
  const pendingInvoices = invoices.filter(invoice => !invoice.paid);
  
  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-gold" />
                Pending Invoices
              </h3>
            </div>
            <div className="text-center py-4 text-gray-400">
              <p className="text-xs">Loading...</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Card className="bg-gray-900 border-gray-800">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-gold" />
              Pending Invoices
            </h3>
            <div className="px-2 py-1 rounded-full bg-red-900/30 text-red-400 border border-red-700 text-xs font-medium">
              {pendingInvoices.length}
            </div>
          </div>
          
          {pendingInvoices.length === 0 ? (
            <div className="text-center py-4 text-gray-400">
              <p className="text-xs">No pending invoices</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {pendingInvoices.slice(0, 3).map(invoice => (
                <div key={invoice.id} className="flex items-center justify-between bg-gray-800 rounded p-2">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <User className="w-3 h-3 text-gray-400 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium text-white truncate">{invoice.customer_name}</p>
                      <p className="text-xs text-gray-400">£{invoice.total.toFixed(2)}</p>
                    </div>
                  </div>
                  <Badge variant="destructive" className="bg-red-600 text-xs px-1 py-0">
                    Unpaid
                  </Badge>
                </div>
              ))}
              {pendingInvoices.length > 3 && (
                <div className="text-xs text-gray-400 text-center pt-1">
                  +{pendingInvoices.length - 3} more
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default CompactPendingInvoices;
