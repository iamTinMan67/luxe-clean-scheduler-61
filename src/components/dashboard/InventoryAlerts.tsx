
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { AlertCircle, Droplets } from "lucide-react";

interface InventoryAlert {
  id: number;
  item: string;
  status: string;
  quantity: number;
  reorderPoint: number;
}

interface InventoryAlertsProps {
  alerts: InventoryAlert[];
}

const InventoryAlerts = ({ alerts }: InventoryAlertsProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
    >
      <Card className="bg-gray-900 border-gray-800 p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-white">Inventory Alerts</h3>
          <div className="px-3 py-1 rounded-full bg-red-900/30 text-red-500 border border-red-700 text-xs font-medium">
            {alerts.length} alerts
          </div>
        </div>
        <div className="space-y-4">
          {alerts.map(alert => (
            <div 
              key={alert.id} 
              className="flex items-center justify-between border-b border-gray-800 pb-3"
            >
              <div className="flex items-start">
                {alert.status === 'out' ? (
                  <AlertCircle className="h-5 w-5 text-red-500 mr-3 mt-0.5" />
                ) : (
                  <Droplets className="h-5 w-5 text-amber-500 mr-3 mt-0.5" />
                )}
                <div>
                  <h4 className="text-white font-medium">{alert.item}</h4>
                  <p className="text-gray-400 text-sm">
                    {alert.status === 'out' 
                      ? 'Out of stock' 
                      : `Low stock: ${alert.quantity} remaining`}
                  </p>
                </div>
              </div>
              <button className="px-3 py-1 rounded-md bg-gray-800 text-white text-sm hover:bg-gray-700 transition-colors">
                Reorder
              </button>
            </div>
          ))}
        </div>
      </Card>
    </motion.div>
  );
};

export default InventoryAlerts;
