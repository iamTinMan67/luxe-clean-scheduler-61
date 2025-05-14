
import { useState } from "react";
import { CustomerFeedback } from "@/components/feedback/types";
import { toast } from "@/components/ui/use-toast";

export const useFeedbackStorage = () => {
  const [feedback, setFeedback] = useState<CustomerFeedback[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Load feedback from localStorage
  const loadFeedback = () => {
    setLoading(true);
    
    // Get feedback from direct submissions
    const storedFeedback = localStorage.getItem("customerFeedback");
    
    let allFeedback: CustomerFeedback[] = [];
    
    // Process direct feedback submissions
    if (storedFeedback) {
      try {
        const parsedFeedback = JSON.parse(storedFeedback);
        const formattedFeedback = parsedFeedback.map((item: any) => ({
          id: item.id || `feedback-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
          bookingId: item.bookingId || "",
          customerName: item.name || "",
          name: item.name || "",
          email: item.email || "",
          date: item.date || new Date().toISOString(),
          rating: item.rating || 0,
          comment: item.comment || "",
          responded: item.responded || false,
          images: item.images || []
        }));
        allFeedback = [...allFeedback, ...formattedFeedback];
      } catch (error) {
        console.error("Error parsing feedback:", error);
      }
    }
    
    setFeedback(allFeedback);
    setLoading(false);
    
    return allFeedback;
  };

  // Save feedback
  const saveFeedback = (newFeedback: CustomerFeedback[]) => {
    localStorage.setItem("customerFeedback", JSON.stringify(newFeedback));
    setFeedback(newFeedback);
  };

  // Mark as responded
  const markAsResponded = (feedbackId: string) => {
    const updatedFeedback = feedback.map(item => 
      item.id === feedbackId ? { ...item, responded: true } : item
    );
    saveFeedback(updatedFeedback);
    toast({
      title: "Feedback marked as responded",
      description: "You've successfully responded to this feedback."
    });
  };

  return {
    feedback,
    loading,
    loadFeedback,
    saveFeedback,
    markAsResponded,
    setFeedback
  };
};
