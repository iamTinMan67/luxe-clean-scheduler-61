
import { CustomerFeedback } from "@/components/feedback/types";

export const useFeedbackGallery = () => {
  // Load gallery feedback
  const loadGalleryFeedback = () => {
    // Get feedback from gallery items
    const storedGallery = localStorage.getItem("galleryItems");
    let galleryFeedback: CustomerFeedback[] = [];
    
    // Process feedback from gallery items
    if (storedGallery) {
      try {
        const parsedGallery = JSON.parse(storedGallery);
        galleryFeedback = parsedGallery
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
      } catch (error) {
        console.error("Error parsing gallery items:", error);
      }
    }
    
    return galleryFeedback;
  };

  // Update gallery with feedback
  const updateGalleryWithFeedback = (feedbackItem: CustomerFeedback) => {
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
    loadGalleryFeedback,
    updateGalleryWithFeedback
  };
};
