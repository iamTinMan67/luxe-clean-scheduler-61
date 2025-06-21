
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft, MessageSquare, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import FeedbackDistribution from "@/components/dashboard/FeedbackDistribution";
import FeedbackSnippet from "@/components/home/feedback/FeedbackSnippet";

const FeedbackScreen = () => {
  const feedbackItems = [
    {
      title: 'Feedback Form',
      description: 'Customer feedback collection',
      path: '/admin/feedback-form',
      icon: MessageSquare
    },
    {
      title: 'Feedback Manager',
      description: 'Review and respond to feedback',
      path: '/admin/feedback-manager',
      icon: Star
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
        <h1 className="text-3xl font-bold text-white mb-2">Customer Feedback</h1>
        <p className="text-gold">Manage customer feedback and reviews</p>
      </div>

      <div className="max-w-4xl mx-auto space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {feedbackItems.map((item, index) => {
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

        {/* Feedback Analytics Section */}
        <div className="space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card className="bg-gray-900 border-gray-800 p-6">
              <h3 className="text-lg font-bold text-white mb-4">Recent Customer Feedback</h3>
              <FeedbackSnippet dashboardMode={true} />
            </Card>
          </motion.div>

          <FeedbackDistribution />
        </div>
      </div>
    </motion.div>
  );
};

export default FeedbackScreen;
