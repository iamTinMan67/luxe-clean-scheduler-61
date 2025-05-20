
import { motion } from "framer-motion";
import { useFeedbackManager } from "@/hooks/useFeedbackManager";
import FeedbackSectionHeader from "./feedback/FeedbackSectionHeader";
import FeedbackGrid from "./feedback/FeedbackGrid";
import { useFeedbackFilter } from "./feedback/useFeedbackFilter";
import { useMockFeedback } from "./feedback/useMockFeedback";

const FeedbackSection = () => {
  const { feedback, loading } = useFeedbackManager();
  const { displayFeedback } = useFeedbackFilter(feedback);
  const { combinedFeedback } = useMockFeedback(displayFeedback);

  if (loading || combinedFeedback.length === 0) return null;

  return (
    <section className="py-16 bg-black">
      <div className="container mx-auto px-4">
        <FeedbackSectionHeader />
        <FeedbackGrid feedback={combinedFeedback} />
      </div>
    </section>
  );
};

export default FeedbackSection;
