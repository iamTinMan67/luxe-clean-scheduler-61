
import { useState } from "react";
import FeedbackDetailsDialog from "@/components/feedback/FeedbackDetailsDialog";
import FeedbackTabs from "@/components/feedback/FeedbackTabs";
import { useFeedbackData } from "@/hooks/useFeedbackData";
import { CustomerFeedback } from "@/components/feedback/types";
import { Skeleton } from "@/components/ui/skeleton";

const FeedbackManager = () => {
  const { feedback, markAsResponded } = useFeedbackData();
  const [selectedFeedback, setSelectedFeedback] = useState<CustomerFeedback | null>(null);
  const [feedbackDialogOpen, setFeedbackDialogOpen] = useState(false);
  
  // View feedback details
  const viewFeedbackDetails = (feedbackItem: CustomerFeedback) => {
    setSelectedFeedback(feedbackItem);
    setFeedbackDialogOpen(true);
  };

  // Handle marking feedback as responded
  const handleMarkAsResponded = (feedbackId: string) => {
    markAsResponded(feedbackId);
    setFeedbackDialogOpen(false);
  };

  return (
    <div className="container px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Customer Feedback Manager</h1>
      
      <FeedbackTabs 
        feedback={feedback} 
        onViewFeedback={viewFeedbackDetails} 
      />
      
      {/* Feedback Details Dialog */}
      <FeedbackDetailsDialog 
        open={feedbackDialogOpen}
        onOpenChange={setFeedbackDialogOpen}
        feedback={selectedFeedback}
        onMarkAsResponded={handleMarkAsResponded}
      />
    </div>
  );
};

export default FeedbackManager;
