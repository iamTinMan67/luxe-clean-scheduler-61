
import { useEffect, useState } from "react";

export type FeedbackItem = {
  id: string;
  name?: string;
  rating: number;
  comment: string;
  date?: string;
  images?: string[];
};

export const useMockFeedback = (displayFeedback: FeedbackItem[]) => {
  const [combinedFeedback, setCombinedFeedback] = useState<FeedbackItem[]>([]);
  
  useEffect(() => {
    if (displayFeedback.length < 6) {
      const mockFeedback = [
        {
          id: "mock-1",
          name: "Sarah Thompson",
          rating: 5,
          comment: "Absolutely amazing service. My car hasn't looked this good since I bought it!",
          date: new Date().toISOString(),
          images: ["https://images.unsplash.com/photo-1605515298946-d0573c9b2fdc?q=80&w=1915&auto=format&fit=crop"]
        },
        {
          id: "mock-2",
          name: "Robert Johnson",
          rating: 4,
          comment: "Professional service and attention to detail. The interior cleaning was exceptional.",
          date: new Date().toISOString(),
          images: ["https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?q=80&w=1887&auto=format&fit=crop"]
        },
        {
          id: "mock-3",
          name: "Emma Davis",
          rating: 5,
          comment: "Brilliant work on my heavily soiled vehicle. The team went above and beyond.",
          date: new Date().toISOString(),
          images: ["https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1170&auto=format&fit=crop"]
        },
        {
          id: "mock-4",
          name: "James Wilson",
          rating: 5,
          comment: "Fantastic results and great value for money. Will definitely use again!",
          date: new Date().toISOString()
        },
        {
          id: "mock-5",
          name: "Olivia Green",
          rating: 4,
          comment: "Very thorough cleaning service. My car looks like new again.",
          date: new Date().toISOString()
        },
        {
          id: "mock-6",
          name: "David Brown",
          rating: 5,
          comment: "Exceptional service from start to finish. Highly recommended!",
          date: new Date().toISOString()
        }
      ];
      
      // Add enough mock feedback to reach 6 items
      const combined = [...displayFeedback];
      let i = 0;
      while (combined.length < 6 && i < mockFeedback.length) {
        combined.push(mockFeedback[i]);
        i++;
      }
      
      setCombinedFeedback(combined);
    } else {
      setCombinedFeedback(displayFeedback);
    }
  }, [displayFeedback]);

  return { combinedFeedback };
};
