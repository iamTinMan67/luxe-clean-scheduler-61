
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft, Truck, Warehouse } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const InventoryScreen = () => {
  const inventoryItems = [
    { title: 'Van Inventory', path: '/admin/van-inventory', icon: Truck },
    { title: 'Warehouse Inventory', path: '/admin/warehouse-inventory', icon: Warehouse }
  ];

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto"
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

        <h1 className="text-3xl font-bold text-center mb-12 text-yellow-400">
          Inventory Management
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
          {inventoryItems.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Link to={item.path}>
                  <Card className="bg-gray-900 border-gray-700 hover:border-yellow-400 transition-all duration-300 cursor-pointer group">
                    <CardContent className="p-6">
                      <div className="flex flex-col items-center space-y-4">
                        <IconComponent className="w-8 h-8 text-gray-400 group-hover:text-yellow-400 transition-colors duration-300" />
                        <span className="text-white group-hover:text-yellow-400 transition-colors duration-300 font-medium text-center">
                          {item.title}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
};

export default InventoryScreen;
