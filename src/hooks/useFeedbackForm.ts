
import { useState } from "react";
import { toast } from "@/components/ui/use-toast";
import { FeedbackFormData } from "@/components/feedback/form/FeedbackFormFields";

interface UseFeedbackFormProps {
  bookingId: string;
  isPaid: boolean;
  redirectPath: string;
  onSuccess?: () => void;
}

export const useFeedbackForm = ({ 
  bookingId, 
  isPaid, 
  redirectPath,
  onSuccess
}: UseFeedbackFormProps) => {
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);

  // Check if feedback already exists for this booking
  const checkExistingFeedback = () => {
    if (bookingId) {
      // Check existing feedback
      const storedFeedback = localStorage.getItem("customerFeedback");
      if (storedFeedback) {
        try {
          const feedbackArray = JSON.parse(storedFeedback);
          const existingFeedback = feedbackArray.find((f: any) => f.bookingId === bookingId);
          
          if (existingFeedback) {
            setIsSubmitted(true);
            toast({
              description: "Feedback has already been submitted for this booking."
            });
          }
        } catch (error) {
          console.error("Error checking feedback:", error);
        }
      }
      setLoading(false);
    }
  };

  // Submit the feedback
  const submitFeedback = (data: FeedbackFormData) => {
    // Check if feedback is already submitted
    if (isSubmitted) {
      toast({
        variant: "destructive",
        description: "You have already submitted feedback for this booking."
      });
      return;
    }

    // Verify that the invoice is paid
    if (!isPaid) {
      toast({
        variant: "destructive",
        description: "Feedback can only be submitted for paid bookings."
      });
      return;
    }

    if (data.rating === 0) {
      toast({
        variant: "destructive",
        description: "Please select a rating"
      });
      return;
    }

    // Check if bookingId is provided
    if (!bookingId) {
      toast({
        variant: "destructive",
        description: "Error: Missing booking reference."
      });
      return;
    }

    // Prepare submission data
    const feedbackData = {
      ...data,
      bookingId,
      images: uploadedImages,
      date: new Date().toISOString(),
    };

    // Store feedback in localStorage for now
    saveToLocalStorage(feedbackData);
    updateGalleryItems(feedbackData);

    toast({
      description: "Your feedback has been submitted successfully."
    });
    
    // Mark as submitted locally
    setIsSubmitted(true);
    
    // Call onSuccess callback if provided
    if (onSuccess) {
      onSuccess();
    }
  };

  const saveToLocalStorage = (feedbackData: any) => {
    const storedFeedback = localStorage.getItem("customerFeedback");
    const feedbackArray = storedFeedback ? JSON.parse(storedFeedback) : [];
    feedbackArray.push(feedbackData);
    localStorage.setItem("customerFeedback", JSON.stringify(feedbackArray));
  };

  const updateGalleryItems = (feedbackData: any) => {
    // Only update gallery if there are images
    if (!feedbackData.images || feedbackData.images.length === 0) return;

    const galleryItemsStr = localStorage.getItem('galleryItems');
    if (galleryItemsStr) {
      try {
        const galleryItems = JSON.parse(galleryItemsStr);
        
        // Find if there's already a gallery item for this booking
        const existingItemIndex = galleryItems.findIndex((item: any) => 
          item.bookingId === bookingId
        );
        
        if (existingItemIndex >= 0) {
          // Update existing gallery item with feedback and images
          galleryItems[existingItemIndex] = {
            ...galleryItems[existingItemIndex],
            customerReview: {
              rating: feedbackData.rating,
              comment: feedbackData.comment,
              date: new Date(),
              customerName: feedbackData.name,
              images: feedbackData.images
            }
          };
        } else {
          // Create a new gallery item for this booking with the review and images
          const newItem = {
            id: Date.now(),
            category: "customer-feedback",
            bookingId,
            title: `${feedbackData.name}'s Review`,
            images: feedbackData.images,
            description: feedbackData.comment,
            customerReview: {
              rating: feedbackData.rating,
              comment: feedbackData.comment,
              date: new Date(),
              customerName: feedbackData.name
            }
          };
          
          galleryItems.push(newItem);
        }
        
        // Save updated gallery items
        localStorage.setItem('galleryItems', JSON.stringify(galleryItems));
      } catch (error) {
        console.error('Error updating gallery items:', error);
      }
    }
  };

  return {
    isSubmitted,
    loading,
    uploadedImages,
    setUploadedImages,
    setLoading,
    checkExistingFeedback,
    submitFeedback
  };
};
