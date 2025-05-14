
import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { format } from "date-fns";
import { Star } from "lucide-react";

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
  };

  // View feedback details
  const viewFeedbackDetails = (feedbackItem: CustomerFeedback) => {
    setSelectedFeedback(feedbackItem);
    setFeedbackDialogOpen(true);
  };

  // Get formatted date
  const getFormattedDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd MMM yyyy");
    } catch (error) {
      return dateString;
    }
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
      <Dialog open={feedbackDialogOpen} onOpenChange={setFeedbackDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Customer Feedback</DialogTitle>
            <DialogDescription>
              Details of the feedback submitted by {selectedFeedback?.customerName}
            </DialogDescription>
          </DialogHeader>
          
          {selectedFeedback && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    {getFormattedDate(selectedFeedback.date)}
                  </p>
                  <h3 className="text-lg font-semibold">{selectedFeedback.customerName}</h3>
                  {selectedFeedback.email && (
                    <p className="text-sm">{selectedFeedback.email}</p>
                  )}
                </div>
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={18}
                      className={i < selectedFeedback.rating ? "fill-gold text-gold" : "text-gray-300"}
                    />
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-1">Comment:</h4>
                <p className="text-sm border rounded-md p-3 bg-muted/50">{selectedFeedback.comment}</p>
              </div>
              
              {selectedFeedback.images && selectedFeedback.images.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">Images:</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {selectedFeedback.images.map((img, index) => (
                      <img
                        key={index}
                        src={img}
                        alt={`Feedback image ${index + 1}`}
                        className="rounded-md w-full h-32 object-cover"
                      />
                    ))}
                  </div>
                </div>
              )}
              
              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={() => setFeedbackDialogOpen(false)}>
                  Close
                </Button>
                {!selectedFeedback.responded && (
                  <Button onClick={() => markAsResponded(selectedFeedback.id)}>
                    Mark as Responded
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

interface FeedbackTableProps {
  feedback: CustomerFeedback[];
  onViewFeedback: (feedback: CustomerFeedback) => void;
}

const FeedbackTable = ({ feedback, onViewFeedback }: FeedbackTableProps) => {
  // Format date function
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd MMM yyyy");
    } catch (error) {
      return dateString;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Customer Feedback</CardTitle>
        <CardDescription>
          Review and respond to customer feedback for your services
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Feedback</TableHead>
              <TableHead>Images</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {feedback.length > 0 ? (
              feedback.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{formatDate(item.date)}</TableCell>
                  <TableCell>{item.customerName}</TableCell>
                  <TableCell>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={16}
                          className={i < item.rating ? "fill-gold text-gold" : "text-gray-300"}
                        />
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="max-w-xs truncate">{item.comment}</TableCell>
                  <TableCell>
                    {item.images && item.images.length > 0 ? (
                      <Badge variant="outline">{item.images.length} images</Badge>
                    ) : (
                      <span className="text-gray-500 text-sm">None</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant={item.responded ? "outline" : "default"}>
                      {item.responded ? "Responded" : "Awaiting Response"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" onClick={() => onViewFeedback(item)}>
                        View
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-4">
                  No feedback found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default FeedbackManager;
