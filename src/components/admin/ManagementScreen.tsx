
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Package,
  Truck,
  Warehouse,
  Camera,
  FileText,
  MessageSquare,
  Star,
  Settings
} from "lucide-react";

const ManagementScreen = () => {
  const managementItems = [
    {
      category: 'Inventory',
      items: [
        { title: 'Van Inventory', path: '/admin/van-inventory', icon: Truck },
        { title: 'Warehouse Inventory', path: '/admin/warehouse-inventory', icon: Warehouse }
      ]
    },
    {
      category: 'Feedback',
      items: [
        { title: 'Feedback Form', path: '/admin/feedback-form', icon: MessageSquare },
        { title: 'Feedback Manager', path: '/admin/feedback-manager', icon: Star }
      ]
    },
    {
      category: 'Packages',
      items: [
        { title: 'Manage Packages', path: '/admin/manage-packages', icon: Package }
      ]
    },
    {
      category: 'Misc Pages',
      items: [
        { title: 'Gallery Manager', path: '/admin/gallery-manager', icon: Camera },
        { title: 'Brochure', path: '/admin/brochure', icon: FileText },
        { title: 'History', path: '/admin/history', icon: FileText },
        { title: 'Analytics', path: '/admin/analytics', icon: Settings }
      ]
    }
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
          Management
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {managementItems.map((section) => (
            <motion.div
              key={section.category}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <h2 className="text-xl font-semibold text-yellow-400 mb-4">
                {section.category}
              </h2>
              
              <div className="space-y-4">
                {section.items.map((item, index) => {
                  const IconComponent = item.icon;
                  return (
                    <motion.div
                      key={item.title}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <Link to={item.path}>
                        <Card className="bg-gray-900 border-gray-700 hover:border-yellow-400 transition-all duration-300 cursor-pointer group">
                          <CardContent className="p-4">
                            <div className="flex items-center space-x-4">
                              <div className="w-6 h-6 border-2 border-gray-400 group-hover:border-yellow-400 transition-colors duration-300" />
                              <IconComponent className="w-5 h-5 text-gray-400 group-hover:text-yellow-400 transition-colors duration-300" />
                              <span className="text-white group-hover:text-yellow-400 transition-colors duration-300 font-medium">
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
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default ManagementScreen;
