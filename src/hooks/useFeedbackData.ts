
import { useState, useEffect } from "react";
import { CustomerFeedback } from "@/components/feedback/types";
import { toast } from "@/components/ui/use-toast";

export const useFeedbackData = () => {
  const [feedback, setFeedback] = useState<CustomerFeedback[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Load feedback data
  useEffect(() => {
    loadFeedbackData();
  }, []);

  const loadFeedbackData = () => {
    setLoading(true);
    // First check for new format feedback
    const storedFeedback = localStorage.getItem("customerFeedback");
    
    // Then check gallery items for feedback
    const storedGallery = localStorage.getItem("galleryItems");
    
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
        galleryFeedback.forEach((item: CustomerFeedback) => {
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
    
    // If no feedback is found, add mock data for demonstration
    if (allFeedback.length === 0) {
      allFeedback = getMockFeedback();
    }
    
    setFeedback(allFeedback);
    setLoading(false);
  };

  // Mark feedback as responded
  const markAsResponded = (feedbackId: string) => {
    const updatedFeedback = feedback.map(item => 
      item.id === feedbackId ? { ...item, responded: true } : item
    );
    setFeedback(updatedFeedback);
    localStorage.setItem("customerFeedback", JSON.stringify(updatedFeedback));
    toast({
      title: "Feedback marked as responded",
      description: "The feedback has been marked as responded."
    });
  };

  // Mock data for demonstration
  const getMockFeedback = (): CustomerFeedback[] => {
    return [
      {
        id: "1",
        bookingId: "b001",
        customerName: "John Smith",
        name: "John Smith",
        email: "john@example.com",
        date: "2025-05-10T10:00:00Z",
        rating: 5,
        comment: "Excellent service! My car looks brand new. The team was professional and thorough.",
        responded: true,
        images: [
          "https://images.unsplash.com/photo-1605515298946-d0573c9b2fdc?q=80&w=1915&auto=format&fit=crop"
        ]
      },
      {
        id: "2",
        bookingId: "b002",
        customerName: "Emily Johnson",
        name: "Emily Johnson",
        email: "emily@example.com",
        date: "2025-05-11T14:30:00Z",
        rating: 4,
        comment: "Great job, very thorough cleaning. The interior detailing was particularly good.",
        responded: false,
        images: [
          "https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?q=80&w=1887&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1170&auto=format&fit=crop"
        ]
      },
      {
        id: "3",
        bookingId: "b003",
        customerName: "Michael Brown",
        name: "Michael Brown",
        date: "2025-05-12T09:15:00Z",
        rating: 3,
        comment: "Good service but could improve on interior detailing. The exterior was spotless though.",
        responded: false
      }
    ];
  };

  return {
    feedback,
    loading,
    markAsResponded
  };
};
