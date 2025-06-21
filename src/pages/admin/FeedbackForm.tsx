
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import FeedbackFormComponent from "@/components/feedback/FeedbackFormComponent";

const FeedbackForm = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container mx-auto py-12 px-4"
    >
      <div className="flex items-center mb-8">
        <Link 
          to="/admin/feedback" 
          className="flex items-center space-x-2 text-yellow-400 hover:text-yellow-300 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Feedback</span>
        </Link>
      </div>

      <h1 className="text-3xl font-bold text-white mb-6 text-center">Customer Feedback Form</h1>
      
      <div className="max-w-2xl mx-auto">
        <Card className="bg-black/60 border-gold/30">
          <CardHeader>
            <CardTitle className="text-white">Submit Feedback</CardTitle>
          </CardHeader>
          <CardContent>
            <FeedbackFormComponent />
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
};

export default FeedbackForm;
