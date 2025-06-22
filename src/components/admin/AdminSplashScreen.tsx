
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Calendar,
  FileText,
  Settings,
  MessageSquare,
  Package,
  BarChart3,
  CheckSquare,
  ClipboardList,
  Truck
} from "lucide-react";
import CompactPendingBookings from "./splash/CompactPendingBookings";
import CompactInventoryAlerts from "./splash/CompactInventoryAlerts";

const AdminSplashScreen = () => {
  const categories = [
    {
      id: 'general',
      title: 'General',
      items: [
        { title: 'Daily', path: '/admin/daily', icon: Calendar },
        { title: 'Invoices', path: '/admin/invoices', icon: FileText },
        { title: 'History', path: '/admin/history', icon: ClipboardList }
      ]
    },
    {
      id: 'management',
      title: 'Manage',
      path: '/admin/management',
      icon: Settings
    },
    {
      id: 'feedback',
      title: 'Feedback',
      path: '/admin/feedback',
      icon: MessageSquare
    },
    {
      id: 'inventory',
      title: 'Inventory',
      path: '/admin/inventory',
      icon: Truck
    },
    {
      id: 'analytics',
      title: 'Analytics',
      path: '/admin/analytics',
      icon: BarChart3
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white p-8 relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl mx-auto"
      >
        <h1 className="text-3xl font-bold text-center mb-12 text-yellow-400">
          Admin Dashboard
        </h1>

        {/* Quick Status Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <CompactPendingBookings />
          <CompactInventoryAlerts />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* General Section - Direct Links */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <h2 className="text-xl font-semibold text-yellow-400 mb-6">
              General
            </h2>
            
            <div className="space-y-4">
              {categories[0].items.map((item, index) => {
                const IconComponent = item.icon;
                return (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <Link to={item.path}>
                      <Card className="bg-gray-900 border-gray-700 hover:border-yellow-400 transition-all duration-300 cursor-pointer group h-full">
                        <CardContent className="p-6 text-center">
                          <div className="flex flex-col items-center space-y-4">
                            <div className="p-4 bg-gray-800 rounded-lg group-hover:bg-yellow-400/20 transition-colors">
                              <IconComponent className="w-8 h-8 text-yellow-400" />
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold text-white group-hover:text-yellow-400 transition-colors mb-2">
                                {item.title}
                              </h3>
                              <p className="text-gray-400 text-sm">
                                {item.title === 'Daily' ? 'Access your daily workflow tools' : 
                                 item.title === 'Invoices' ? 'Create, view, and manage customer invoices' :
                                 'View past bookings and service records'}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Other Categories Section */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="space-y-6"
          >
            <h2 className="text-xl font-semibold text-yellow-400 mb-6">
              Management
            </h2>
            
            <div className="space-y-4">
              {categories.slice(1).map((category, index) => {
                const IconComponent = category.icon;
                return (
                  <motion.div
                    key={category.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <Link to={category.path}>
                      <Card className="bg-gray-900 border-gray-700 hover:border-yellow-400 transition-all duration-300 cursor-pointer group h-full">
                        <CardContent className="p-6 text-center">
                          <div className="flex flex-col items-center space-y-4">
                            <div className="p-4 bg-gray-800 rounded-lg group-hover:bg-yellow-400/20 transition-colors">
                              <IconComponent className="w-8 h-8 text-yellow-400" />
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold text-white group-hover:text-yellow-400 transition-colors mb-2">
                                {category.title}
                              </h3>
                              <p className="text-gray-400 text-sm">
                                {category.title === 'Manage' ? 'Business management tools' : 
                                 category.title === 'Feedback' ? 'Customer feedback and reviews' :
                                 category.title === 'Inventory' ? 'Stock and equipment tracking' :
                                 'Business insights and reports'}
                              </p>
                            </div>
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
      </motion.div>
    </div>
  );
};

export default AdminSplashScreen;
