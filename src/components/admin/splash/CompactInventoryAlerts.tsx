
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, Package } from "lucide-react";

const CompactInventoryAlerts = () => {
  // Mock inventory alerts data
  const alerts = [
    { id: 1, item: "Car Wax", status: "low", quantity: 3, reorderPoint: 5 },
    { id: 2, item: "Microfiber Cloths", status: "out", quantity: 0, reorderPoint: 10 },
    { id: 3, item: "Tire Shine", status: "low", quantity: 2, reorderPoint: 5 }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <Card className="bg-gray-900 border-gray-800">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Package className="w-4 h-4 text-gold" />
              Inventory Alerts
            </h3>
            <div className="px-2 py-1 rounded-full bg-red-900/30 text-red-400 border border-red-700 text-xs font-medium">
              {alerts.length}
            </div>
          </div>
          
          {alerts.length === 0 ? (
            <div className="text-center py-4 text-gray-400">
              <p className="text-xs">No inventory alerts</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {alerts.slice(0, 3).map(alert => (
                <div key={alert.id} className="flex items-center justify-between bg-gray-800 rounded p-2">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    {alert.status === 'out' ? (
                      <AlertCircle className="w-3 h-3 text-red-500 flex-shrink-0" />
                    ) : (
                      <AlertCircle className="w-3 h-3 text-amber-500 flex-shrink-0" />
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium text-white truncate">{alert.item}</p>
                      <p className="text-xs text-gray-400">
                        {alert.status === 'out' ? 'Out of stock' : `${alert.quantity} left`}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              {alerts.length > 3 && (
                <div className="text-xs text-gray-400 text-center pt-1">
                  +{alerts.length - 3} more
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default CompactInventoryAlerts;
