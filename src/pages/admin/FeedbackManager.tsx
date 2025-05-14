
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FeedbackTable from "@/components/feedback/FeedbackTable";
import FeedbackDetailsDialog from "@/components/feedback/FeedbackDetailsDialog";
import { useFeedbackManager } from "@/hooks/useFeedbackManager";
import { toast } from "@/components/ui/use-toast";

// Define feedback interface
interface CustomerFeedback {
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

const FeedbackManager = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [feedback, setFeedback] = useState<CustomerFeedback[]>([]);
  const [selectedFeedback, setSelectedFeedback] = useState<CustomerFeedback | null>(null);
  const [feedbackDialogOpen, setFeedbackDialogOpen] = useState(false);
  
  // Load feedback data
  useEffect(() => {
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
  }, []);
  
  // Filter feedback based on active tab
  const filteredFeedback = activeTab === "all" 
    ? feedback 
    : activeTab === "unresponded"
      ? feedback.filter(item => !item.responded)
      : feedback.filter(item => item.responded);

  // Mark feedback as responded
  const markAsResponded = (feedbackId: string) => {
    const updatedFeedback = feedback.map(item => 
      item.id === feedbackId ? { ...item, responded: true } : item
    );
    setFeedback(updatedFeedback);
    localStorage.setItem("customerFeedback", JSON.stringify(updatedFeedback));
    setFeedbackDialogOpen(false);
    toast({
      title: "Feedback marked as responded",
      description: "The feedback has been marked as responded."
    });
  };

  // View feedback details
  const viewFeedbackDetails = (feedbackItem: CustomerFeedback) => {
    setSelectedFeedback(feedbackItem);
    setFeedbackDialogOpen(true);
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

  return (
    <div className="container px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Customer Feedback Manager</h1>
      
      <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="all">All Feedback</TabsTrigger>
          <TabsTrigger value="unresponded">Awaiting Response</TabsTrigger>
          <TabsTrigger value="responded">Responded</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-0">
          <FeedbackTable 
            feedback={filteredFeedback} 
            onViewFeedback={viewFeedbackDetails} 
          />
        </TabsContent>
        
        <TabsContent value="unresponded" className="mt-0">
          <FeedbackTable 
            feedback={filteredFeedback} 
            onViewFeedback={viewFeedbackDetails} 
          />
        </TabsContent>
        
        <TabsContent value="responded" className="mt-0">
          <FeedbackTable 
            feedback={filteredFeedback} 
            onViewFeedback={viewFeedbackDetails} 
          />
        </TabsContent>
      </Tabs>
      
      {/* Feedback Details Dialog */}
      <FeedbackDetailsDialog 
        open={feedbackDialogOpen}
        onOpenChange={setFeedbackDialogOpen}
        feedback={selectedFeedback}
        onMarkAsResponded={markAsResponded}
      />
    </div>
  );
};

export default FeedbackManager;
