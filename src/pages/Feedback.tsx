
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Star } from "lucide-react";
import { toast } from "sonner";
import { Invoice, GalleryItem } from "@/lib/types";

const Feedback = () => {
  const { invoiceId } = useParams();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState<string>("");
  const [hoveredRating, setHoveredRating] = useState<number>(0);
  const [customerName, setCustomerName] = useState<string>("");
  
  // Load invoice data on component mount
  useEffect(() => {
    const loadInvoice = () => {
      const savedInvoices = localStorage.getItem('invoices');
      if (savedInvoices) {
        try {
          const parsedInvoices = JSON.parse(savedInvoices);
          const foundInvoice = parsedInvoices.find((inv: any) => inv.id === invoiceId);
          
          if (foundInvoice) {
            setInvoice({
              ...foundInvoice,
              date: new Date(foundInvoice.date)
            });
            
            // Load customer info from confirmed bookings
            const confirmedBookings = localStorage.getItem('confirmedBookings');
            if (confirmedBookings) {
              const parsedBookings = JSON.parse(confirmedBookings);
              const relatedBooking = parsedBookings.find((booking: any) => 
                booking.id === foundInvoice.bookingId
              );
              
              if (relatedBooking) {
                setCustomerName(relatedBooking.customer || "");
              }
            }
          } else {
            toast.error("Invoice not found", {
              description: "The requested invoice could not be found."
            });
            navigate("/");
          }
        } catch (error) {
          console.error('Error parsing invoices:', error);
        }
      }
    };
    
    loadInvoice();
  }, [invoiceId, navigate]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (rating === 0) {
      toast.error("Please select a rating", {
        description: "You must provide a star rating before submitting."
      });
      return;
    }
    
    // Save the review to localStorage (in a real app, this would be sent to a server)
    // We'll store this in the galleryItems as a customer review
    const galleryItemsStr = localStorage.getItem('galleryItems');
    let galleryItems: GalleryItem[] = [];
    
    if (galleryItemsStr) {
      try {
        galleryItems = JSON.parse(galleryItemsStr);
      } catch (error) {
        console.error('Error parsing gallery items:', error);
      }
    }
    
    // Find gallery item related to this invoice's booking
    if (invoice) {
      const existingItemIndex = galleryItems.findIndex(item => 
        item.bookingId === invoice.bookingId
      );
      
      if (existingItemIndex >= 0) {
        // Update existing gallery item
        galleryItems[existingItemIndex] = {
          ...galleryItems[existingItemIndex],
          customerReview: {
            rating,
            comment,
            date: new Date()
          }
        };
      } else {
        // Create a new gallery item for this booking
        const newItem: GalleryItem = {
          id: `review-${Date.now()}`,
          bookingId: invoice.bookingId,
          vehicleId: invoice.bookingId, // We don't have the specific vehicle ID, using booking ID as fallback
          beforeImages: [],
          afterImages: [],
          description: "Customer service",
          customerReview: {
            rating,
            comment,
            date: new Date()
          }
        };
        
        galleryItems.push(newItem);
      }
      
      // Save updated gallery items
      localStorage.setItem('galleryItems', JSON.stringify(galleryItems));
      
      toast.success("Feedback submitted", {
        description: "Thank you for your feedback! We appreciate your input."
      });
      
      // Redirect to home after successful submission
      setTimeout(() => {
        navigate("/");
      }, 2000);
    }
  };
  
  return (
    <div className="min-h-screen bg-black">
      <section className="relative py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              Your <span className="text-gold">Feedback</span>
            </h1>
            <p className="text-xl text-gray-300">
              We value your opinion on our services
            </p>
          </motion.div>
          
          <div className="max-w-2xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="bg-gray-900/50 backdrop-blur-sm rounded-lg p-8 border border-gray-800">
                {invoice ? (
                  <form onSubmit={handleSubmit}>
                    <div className="mb-8 text-center">
                      <h2 className="text-2xl font-bold text-white mb-2">
                        How was your experience?
                      </h2>
                      <p className="text-gray-400">
                        {customerName ? `Thank you ${customerName} for choosing our service` : 'Thank you for choosing our service'}
                      </p>
                      <div className="mt-6 flex justify-center space-x-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setRating(star)}
                            onMouseEnter={() => setHoveredRating(star)}
                            onMouseLeave={() => setHoveredRating(0)}
                            className="focus:outline-none transition duration-150"
                          >
                            <Star
                              className={`h-10 w-10 transition-colors ${
                                (hoveredRating ? star <= hoveredRating : star <= rating)
                                  ? "fill-gold text-gold"
                                  : "text-gray-500"
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                      <p className="mt-2 text-gold">
                        {rating === 1 && "Poor"}
                        {rating === 2 && "Fair"}
                        {rating === 3 && "Good"}
                        {rating === 4 && "Very Good"}
                        {rating === 5 && "Excellent"}
                      </p>
                    </div>
                    
                    <div className="space-y-4 mb-8">
                      <div>
                        <label htmlFor="comment" className="block text-white mb-2">Your Comments</label>
                        <Textarea
                          id="comment"
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                          placeholder="Please share your experience with our service..."
                          className="bg-gray-800 border-gray-700 text-white"
                          rows={4}
                        />
                      </div>
                    </div>
                    
                    <div className="flex justify-center">
                      <Button 
                        type="submit" 
                        className="bg-gold hover:bg-gold/80 text-black font-bold transition-colors px-8 py-3"
                      >
                        Submit Feedback
                      </Button>
                    </div>
                  </form>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-400">Loading...</p>
                  </div>
                )}
              </Card>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Feedback;
