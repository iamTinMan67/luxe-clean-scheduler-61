
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import AdminPageTitle from "@/components/admin/AdminPageTitle";
import FeedbackTable from "@/components/feedback/FeedbackTable";
import { useFeedbackManager } from "@/hooks/useFeedbackManager";

const FeedbackManager = () => {
  const {
    feedback,
    loading,
    loadFeedback,
    addFeedback,
    markAsResponded
  } = useFeedbackManager();

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

      <AdminPageTitle 
        title="Feedback Manager" 
        subtitle="Review and manage customer feedback" 
      />
      
      <FeedbackTable
        feedback={feedback}
        loading={loading}
        searchTerm=""
        setSearchTerm={() => {}}
        statusFilter="all"
        setStatusFilter={() => {}}
        onStatusUpdate={markAsResponded}
        onDelete={() => {}}
      />
    </motion.div>
  );
};

export default FeedbackManager;
