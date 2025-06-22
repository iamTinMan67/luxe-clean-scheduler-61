
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft, Calendar, CheckSquare, ClipboardList } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useAdminScrollToTop } from "@/hooks/useScrollToTop";

const PlanningScreen = () => {
  // Use scroll to top for admin pages
  useAdminScrollToTop();

  const planningItems = [
    {
      title: 'Planner Calendar',
      description: 'Schedule and manage appointments',
      path: '/admin/planner-calendar',
      icon: Calendar
    },
    {
      title: 'Pre-Inspection',
      description: 'Vehicle condition assessments',
      path: '/admin/pre-inspection',
      icon: CheckSquare
    },
    {
      title: 'To-do List',
      description: 'Task management and tracking',
      path: '/admin/todo-list',
      icon: ClipboardList
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="container mx-auto py-8 px-4"
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

      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-white mb-2">Planning & Scheduling</h1>
        <p className="text-gold">Manage appointments and workflow planning</p>
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {planningItems.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
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
                            {item.description}
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
      </div>
    </motion.div>
  );
};

export default PlanningScreen;
