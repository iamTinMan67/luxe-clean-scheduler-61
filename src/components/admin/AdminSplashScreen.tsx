
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Calendar, 
  FileText, 
  ClipboardList, 
  MessageSquare, 
  DollarSign, 
  Package, 
  Camera, 
  Truck,
  Warehouse,
  BarChart3,
  Settings,
  CheckSquare,
  Users,
  Star
} from "lucide-react";
import { Link } from "react-router-dom";

interface AdminFunction {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  path: string;
  category: 'planning' | 'management' | 'feedback' | 'inventory' | 'analytics';
}

interface CategoryConfig {
  title: string;
  icon: React.ComponentType<any>;
  color: string;
  featured?: boolean;
}

const adminFunctions: AdminFunction[] = [
  // Analytics (Featured)
  {
    id: 'analytics',
    title: 'Business Analytics',
    description: 'Performance metrics and insights',
    icon: BarChart3,
    path: '/admin/analytics',
    category: 'analytics'
  },

  // Planning & Scheduling
  {
    id: 'planner',
    title: 'Planner Calendar',
    description: 'Schedule and manage appointments',
    icon: Calendar,
    path: '/admin/planner-calendar',
    category: 'planning'
  },
  {
    id: 'pre-inspection',
    title: 'Pre-Inspection',
    description: 'Vehicle condition assessments',
    icon: CheckSquare,
    path: '/admin/pre-inspection',
    category: 'planning'
  },
  {
    id: 'todo',
    title: 'To-do List',
    description: 'Task management and tracking',
    icon: ClipboardList,
    path: '/admin/todo-list',
    category: 'planning'
  },

  // Business Management
  {
    id: 'invoices',
    title: 'Invoices',
    description: 'Billing and payment management',
    icon: DollarSign,
    path: '/admin/invoices',
    category: 'management'
  },
  {
    id: 'history',
    title: 'History',
    description: 'Past bookings and records',
    icon: FileText,
    path: '/admin/history',
    category: 'management'
  },
  {
    id: 'packages',
    title: 'Manage Packages',
    description: 'Service package configuration',
    icon: Package,
    path: '/admin/manage-packages',
    category: 'management'
  },
  {
    id: 'brochure',
    title: 'Brochure',
    description: 'Marketing materials',
    icon: FileText,
    path: '/admin/brochure',
    category: 'management'
  },
  {
    id: 'gallery',
    title: 'Gallery Manager',
    description: 'Photo and media management',
    icon: Camera,
    path: '/admin/gallery-manager',
    category: 'management'
  },

  // Customer Feedback
  {
    id: 'feedback-form',
    title: 'Feedback Form',
    description: 'Customer feedback collection',
    icon: MessageSquare,
    path: '/admin/feedback-form',
    category: 'feedback'
  },
  {
    id: 'feedback-manager',
    title: 'Feedback Manager',
    description: 'Review and respond to feedback',
    icon: Star,
    path: '/admin/feedback-manager',
    category: 'feedback'
  },

  // Inventory Management
  {
    id: 'van-inventory',
    title: 'Van Inventory',
    description: 'Mobile equipment tracking',
    icon: Truck,
    path: '/admin/van-inventory',
    category: 'inventory'
  },
  {
    id: 'warehouse-inventory',
    title: 'Warehouse Inventory',
    description: 'Storage and supplies management',
    icon: Warehouse,
    path: '/admin/warehouse-inventory',
    category: 'inventory'
  }
];

const categoryConfig: Record<string, CategoryConfig> = {
  analytics: {
    title: 'Analytics & Insights',
    icon: BarChart3,
    color: 'gold',
    featured: true
  },
  planning: {
    title: 'Planning & Scheduling',
    icon: Calendar,
    color: 'blue'
  },
  management: {
    title: 'Business Management', 
    icon: Settings,
    color: 'green'
  },
  feedback: {
    title: 'Customer Feedback',
    icon: MessageSquare,
    color: 'purple'
  },
  inventory: {
    title: 'Inventory Management',
    icon: Package,
    color: 'orange'
  }
};

const AdminSplashScreen = () => {
  const groupedFunctions = adminFunctions.reduce((acc, func) => {
    if (!acc[func.category]) {
      acc[func.category] = [];
    }
    acc[func.category].push(func);
    return acc;
  }, {} as Record<string, AdminFunction[]>);

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
      >
        <h2 className="text-2xl font-bold text-white mb-2">Welcome to Admin Dashboard</h2>
        <p className="text-gray-400">Select a function to get started</p>
      </motion.div>

      {/* Function Categories */}
      {Object.entries(groupedFunctions).map(([category, functions], categoryIndex) => {
        const config = categoryConfig[category as keyof typeof categoryConfig];
        const IconComponent = config.icon;
        const isFeatured = config.featured || false;
        
        return (
          <motion.div
            key={category}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: categoryIndex * 0.1 }}
            className="space-y-4"
          >
            {/* Category Header */}
            <div className="flex items-center space-x-3 mb-4">
              <div className={`p-2 rounded-lg ${isFeatured ? 'bg-gold/20 border-gold/30' : `bg-${config.color}-500/20 border-${config.color}-500/30`} border`}>
                <IconComponent className={`w-5 h-5 ${isFeatured ? 'text-gold' : `text-${config.color}-400`}`} />
              </div>
              <h3 className="text-lg font-semibold text-white">{config.title}</h3>
              {isFeatured && (
                <span className="px-2 py-1 text-xs bg-gold/20 text-gold rounded-full border border-gold/30">
                  Featured
                </span>
              )}
            </div>

            {/* Function Cards Grid */}
            <div className={`grid gap-4 ${isFeatured ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'}`}>
              {functions.map((func, index) => {
                const FunctionIcon = func.icon;
                
                return (
                  <motion.div
                    key={func.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ 
                      duration: 0.3, 
                      delay: categoryIndex * 0.1 + index * 0.05 
                    }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Link to={func.path}>
                      <Card className={`${isFeatured ? 'bg-gradient-to-r from-gold/10 to-gold/5 border-gold/30' : 'bg-gray-900 border-gray-800'} hover:border-gold/50 transition-all duration-300 cursor-pointer group`}>
                        <CardContent className={`${isFeatured ? 'p-8' : 'p-6'}`}>
                          <div className="flex items-start space-x-4">
                            <div className={`${isFeatured ? 'p-4' : 'p-3'} bg-gray-800 rounded-lg group-hover:bg-gold/20 transition-colors`}>
                              <FunctionIcon className={`${isFeatured ? 'w-8 h-8' : 'w-6 h-6'} text-gold`} />
                            </div>
                            <div className="flex-1">
                              <h4 className={`${isFeatured ? 'text-lg' : 'text-base'} font-semibold text-white mb-1 group-hover:text-gold transition-colors`}>
                                {func.title}
                              </h4>
                              <p className="text-sm text-gray-400">
                                {func.description}
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
        );
      })}

      {/* Quick Stats Footer */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
        className="mt-12 p-6 bg-gray-900/50 border border-gray-800 rounded-lg"
      >
        <div className="flex items-center justify-center space-x-8 text-center">
          <div>
            <div className="text-2xl font-bold text-gold">13</div>
            <div className="text-sm text-gray-400">Admin Functions</div>
          </div>
          <div className="w-px h-12 bg-gray-700"></div>
          <div>
            <div className="text-2xl font-bold text-gold">5</div>
            <div className="text-sm text-gray-400">Categories</div>
          </div>
          <div className="w-px h-12 bg-gray-700"></div>
          <div>
            <div className="text-2xl font-bold text-gold">∞</div>
            <div className="text-sm text-gray-400">Possibilities</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminSplashScreen;
