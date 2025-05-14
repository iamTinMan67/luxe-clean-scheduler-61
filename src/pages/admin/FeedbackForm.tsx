
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { motion } from "framer-motion";
import { useFeedbackManager } from "@/hooks/useFeedbackManager";

const FeedbackForm = () => {
  const navigate = useNavigate();
  const { addFeedback } = useFeedbackManager();
  
  const [formData, setFormData] = useState({
    bookingId: "",
    name: "",
    email: "",
    rating: 5,
    comment: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "rating" ? parseInt(value) : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name || !formData.comment) {
      toast({
        title: "Error",
        description: "Please fill all required fields",
        variant: "destructive"
      });
      return;
    }
    
    // Add feedback
    addFeedback({
      bookingId: formData.bookingId,
      name: formData.name,
      customerName: formData.name,
      email: formData.email,
      rating: formData.rating,
      comment: formData.comment,
      date: new Date().toISOString(),
      images: []
    });
    
    toast({
      title: "Success",
      description: "Feedback submitted successfully"
    });
    
    // Redirect to feedback manager
    navigate("/admin/feedback");
  };

  return (
    <div className="container px-4 py-8 min-h-screen bg-black">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold mb-6 text-white">Create Customer Feedback</h1>
        
        <Card className="max-w-2xl mx-auto bg-black/60 border-gold/30">
          <CardHeader>
            <CardTitle>Customer Feedback Form</CardTitle>
            <CardDescription>Create a new feedback entry for a customer</CardDescription>
          </CardHeader>
          
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="bookingId">Booking Reference (optional)</Label>
                <Input
                  id="bookingId"
                  name="bookingId"
                  placeholder="Enter booking reference"
                  value={formData.bookingId}
                  onChange={handleChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="name">Customer Name *</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Enter customer name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email (optional)</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter customer email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="rating">Rating *</Label>
                <div className="flex items-center space-x-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Button
                      key={star}
                      type="button"
                      variant={formData.rating >= star ? "default" : "outline"}
                      onClick={() => setFormData(prev => ({ ...prev, rating: star }))}
                      size="sm"
                      className={formData.rating >= star ? "bg-gold hover:bg-gold/80" : ""}
                    >
                      {star}
                    </Button>
                  ))}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="comment">Feedback Comments *</Label>
                <Textarea
                  id="comment"
                  name="comment"
                  placeholder="Enter customer feedback"
                  value={formData.comment}
                  onChange={handleChange}
                  rows={4}
                  required
                />
              </div>
            </CardContent>
            
            <CardFooter className="flex justify-between">
              <Button type="button" variant="outline" onClick={() => navigate("/admin/feedback")}>
                Cancel
              </Button>
              <Button type="submit">Submit Feedback</Button>
            </CardFooter>
          </form>
        </Card>
      </motion.div>
    </div>
  );
};

export default FeedbackForm;
