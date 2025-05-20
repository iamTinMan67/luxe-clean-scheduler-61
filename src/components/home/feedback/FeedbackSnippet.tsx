
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { Link } from "react-router-dom";
import { useFeedbackFilter } from "./useFeedbackFilter";
import { useMockFeedback } from "./useMockFeedback";
import { useFeedbackManager } from "@/hooks/useFeedbackManager";

interface FeedbackSnippetProps {
  dashboardMode?: boolean;
}

const FeedbackSnippet = ({ dashboardMode = false }: FeedbackSnippetProps) => {
  const { feedback, loading } = useFeedbackManager();
  const { displayFeedback } = useFeedbackFilter(feedback);
  const { combinedFeedback } = useMockFeedback(displayFeedback);

  // Show at most 3 items in the footer
  const snippetFeedback = combinedFeedback.slice(0, 3);

  if (loading || snippetFeedback.length === 0) return null;

  return (
    <div className={dashboardMode ? "" : "mb-10 pb-8 border-b border-gray-800"}>
      <h3 className="text-lg font-semibold text-white mb-5">
        {dashboardMode ? "Recent Customer Feedback" : "Recent Customer Feedback"}
      </h3>
      <div className="space-y-4">
        {snippetFeedback.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.3 }}
            className="flex gap-3 p-3 bg-gray-900/30 rounded-md border border-gray-800/50"
          >
            <div className="flex-shrink-0">
              <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-gold font-medium">
                {item.name ? item.name.charAt(0) : "C"}
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-1 mb-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={12}
                    className={star <= item.rating ? "fill-gold text-gold" : "text-gray-500"}
                  />
                ))}
              </div>
              <p className="text-gray-300 text-sm line-clamp-2">"{item.comment}"</p>
              <div className="mt-1 text-xs text-gray-400">
                {item.name || "Customer"}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      <div className="text-center mt-5">
        <Link to="/gallery" className="text-gold hover:text-white text-sm inline-flex items-center">
          View all feedback
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-3 w-3 ml-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M14 5l7 7m0 0l-7 7m7-7H3"
            />
          </svg>
        </Link>
      </div>
    </div>
  );
};

export default FeedbackSnippet;
