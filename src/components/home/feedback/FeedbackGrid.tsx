
import { motion } from "framer-motion";
import FeedbackCard from "./FeedbackCard";
import { FeedbackItem } from "./useMockFeedback";
import { Link } from "react-router-dom";

interface FeedbackGridProps {
  feedback: FeedbackItem[];
}

const FeedbackGrid = ({ feedback }: FeedbackGridProps) => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {feedback.map((item, index) => (
          <FeedbackCard key={item.id} item={item} index={index} />
        ))}
      </div>
      
      <div className="text-center mt-10">
        <Link to="/gallery" className="text-gold hover:text-white border-b border-gold hover:border-white transition-colors inline-flex items-center">
          View more customer feedback
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 ml-2"
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
    </>
  );
};

export default FeedbackGrid;
