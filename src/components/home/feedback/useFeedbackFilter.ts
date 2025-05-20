
import { useState, useEffect } from "react";
import { FeedbackItem } from "./useMockFeedback";

export const useFeedbackFilter = (feedback: any[]) => {
  const [displayFeedback, setDisplayFeedback] = useState<FeedbackItem[]>([]);
  
  useEffect(() => {
    if (feedback.length > 0) {
      // Only show feedback with ratings >= 4 and with comments
      const highRatedFeedback = feedback
        .filter(item => item.rating >= 4 && item.comment.trim().length > 0)
        .slice(0, 6); // Show 6 items
      
      setDisplayFeedback(highRatedFeedback);
    }
  }, [feedback]);
  
  return { displayFeedback };
};
