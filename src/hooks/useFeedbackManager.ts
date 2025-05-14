
import { useState, useEffect } from "react";

interface CustomerReview {
  rating: number;
  comment: string;
  date: Date | string;
  customerName?: string;
  images?: string[];
  responded?: boolean;
}

interface FeedbackItem {
  id: string;
  bookingId: string;
  customerName: string;
  name: string;
  email?: string;
  date: string;
  rating: number;
  comment: string;
  responded: boolean;
  images?: string[];
}

export const useFeedbackManager = () => {
  const [feedback, setFeedback] = useState<FeedbackItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Load feedback from localStorage
  useEffect(() => {
    loadFeedback();
  }, []);

  const loadFeedback = () => {
    setLoading(true);
    
    // Get feedback from direct submissions
    const storedFeedback = localStorage.getItem("customerFeedback");
    
    // Get feedback from gallery items
    const storedGallery = localStorage.getItem("galleryItems");
    
    let allFeedback: FeedbackItem[] = [];
    
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
    
    // Process feedback from gallery items
    if (storedGallery) {
      try {
        const parsedGallery = JSON.parse(storedGallery);
        const galleryFeedback = parsedGallery
          .filter((item: any) => item.customerReview)
          .map((item: any) => ({
            id: `gallery-${item.id || Date.now()}`,
            bookingId: item.bookingId || "",
            customerName: item.customerReview?.customerName || "",
            name: item.customerReview?.customerName || "",
            date: item.customerReview?.date || new Date().toISOString(),
            rating: item.customerReview?.rating || 0,
            comment: item.customerReview?.comment || "",
            responded: item.customerReview?.responded || false,
            images: item.images || []
          }));
        
        // Add unique gallery feedback (avoid duplicates)
        galleryFeedback.forEach((item: FeedbackItem) => {
          if (!allFeedback.some(f => f.id === item.id)) {
            allFeedback.push(item);
          }
        });
      } catch (error) {
        console.error("Error parsing gallery items:", error);
      }
    }
    
    // Sort by date (newest first)
    allFeedback.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    setFeedback(allFeedback);
    setLoading(false);
  };

  // Save feedback
  const saveFeedback = (newFeedback: FeedbackItem[]) => {
    localStorage.setItem("customerFeedback", JSON.stringify(newFeedback));
    setFeedback(newFeedback);
  };

  // Add new feedback
  const addFeedback = (feedbackData: Omit<FeedbackItem, "id" | "responded">) => {
    const newFeedback = {
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

  // Mark as responded
  const markAsResponded = (feedbackId: string) => {
    const updatedFeedback = feedback.map(item => 
      item.id === feedbackId ? { ...item, responded: true } : item
    );
    saveFeedback(updatedFeedback);
  };

  // Update gallery with feedback
  const updateGalleryWithFeedback = (feedbackItem: FeedbackItem) => {
    const galleryItemsStr = localStorage.getItem('galleryItems');
    if (!galleryItemsStr) return;
    
    try {
      const galleryItems = JSON.parse(galleryItemsStr);
      
      // Find if there's already a gallery item for this booking
      const existingItemIndex = galleryItems.findIndex((item: any) => 
        item.bookingId === feedbackItem.bookingId
      );
      
      const customerReview = {
        rating: feedbackItem.rating,
        comment: feedbackItem.comment,
        date: feedbackItem.date,
        customerName: feedbackItem.name
      };
      
      if (existingItemIndex >= 0) {
        // Update existing gallery item
        galleryItems[existingItemIndex] = {
          ...galleryItems[existingItemIndex],
          customerReview
        };
        
        // Add images if not already present
        if (feedbackItem.images && feedbackItem.images.length > 0) {
          if (!galleryItems[existingItemIndex].images) {
            galleryItems[existingItemIndex].images = [];
          }
          
          galleryItems[existingItemIndex].images = [
            ...galleryItems[existingItemIndex].images,
            ...feedbackItem.images
          ];
        }
      } else if (feedbackItem.images && feedbackItem.images.length > 0) {
        // Create a new gallery item
        const newItem = {
          id: Date.now(),
          category: "customer-feedback",
          bookingId: feedbackItem.bookingId,
          title: `${feedbackItem.name}'s Review`,
          images: feedbackItem.images,
          description: feedbackItem.comment,
          customerReview
        };
        
        galleryItems.push(newItem);
      }
      
      // Save updated gallery items
      localStorage.setItem('galleryItems', JSON.stringify(galleryItems));
    } catch (error) {
      console.error('Error updating gallery items:', error);
    }
  };

  return {
    feedback,
    loading,
    loadFeedback,
    addFeedback,
    markAsResponded
  };
};
