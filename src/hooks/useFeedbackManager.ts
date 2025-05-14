
import { useEffect } from "react";
import { CustomerFeedback } from "@/components/feedback/types";
import { useFeedbackStorage } from "./useFeedbackStorage";
import { useFeedbackGallery } from "./useFeedbackGallery";

export const useFeedbackManager = () => {
  const { 
    feedback, 
    loading, 
    loadFeedback: loadStoredFeedback, 
    saveFeedback,
    markAsResponded,
    setFeedback 
  } = useFeedbackStorage();
  
  const { 
    loadGalleryFeedback, 
    updateGalleryWithFeedback 
  } = useFeedbackGallery();

  // Load all feedback on mount
  useEffect(() => {
    loadFeedback();
  }, []);

  // Load all feedback (from storage and gallery)
  const loadFeedback = () => {
    // First load feedback from direct submissions
    const storedFeedback = loadStoredFeedback();
    
    // Then load feedback from gallery items
    const galleryFeedback = loadGalleryFeedback();
    
    let allFeedback = [...storedFeedback];
    
    // Add unique gallery feedback (avoid duplicates)
    galleryFeedback.forEach((item: CustomerFeedback) => {
      if (!allFeedback.some(f => f.id === item.id)) {
        allFeedback.push(item);
      }
    });
    
    // Sort by date (newest first)
    allFeedback.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    setFeedback(allFeedback);
  };

  // Add new feedback
  const addFeedback = (feedbackData: Omit<CustomerFeedback, "id" | "responded">) => {
    const newFeedback: CustomerFeedback = {
      ...feedbackData,
      id: `feedback-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      responded: false
    };
    
    const updatedFeedback = [...feedback, newFeedback];
    saveFeedback(updatedFeedback);
    
    // Update gallery if the feedback has images
    if (feedbackData.images && feedbackData.images.length > 0) {
      updateGalleryWithFeedback(newFeedback);
    }
    
    return newFeedback;
  };

  return {
    feedback,
    loading,
    loadFeedback,
    addFeedback,
    markAsResponded
  };
};
