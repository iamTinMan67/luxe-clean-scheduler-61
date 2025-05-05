
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

const TrackBooking = () => {
  const [reference, setReference] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!reference.trim()) {
      toast.error("Please enter a booking reference");
      return;
    }
    
    setIsLoading(true);
    
    // Check if the booking exists in localStorage
    const confirmedBookingsStr = localStorage.getItem('confirmedBookings');
    const invoicesStr = localStorage.getItem('invoices');
    
    let found = false;
    
    try {
      // Check in confirmed bookings
      if (confirmedBookingsStr) {
        const confirmedBookings = JSON.parse(confirmedBookingsStr);
        if (confirmedBookings.some((booking: any) => booking.id === reference)) {
          found = true;
        }
      }
      
      // Check in invoices
      if (!found && invoicesStr) {
        const invoices = JSON.parse(invoicesStr);
        if (invoices.some((invoice: any) => invoice.id === reference)) {
          found = true;
        }
      }
      
      if (found) {
        // Navigate to the progress page with the reference
        navigate(`/progress?invoiceId=${reference}`);
      } else {
        toast.error("Booking reference not found", {
          description: "Please check the reference and try again."
        });
      }
    } catch (error) {
      console.error("Error searching for booking:", error);
      toast.error("Something went wrong", {
        description: "Please try again later."
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-md mx-auto text-center mb-10"
        >
          <h1 className="text-4xl font-bold mb-4">Track Your <span className="text-gold">Valet</span></h1>
          <p className="text-gray-300">
            Enter your booking reference to track the progress of your valet service.
          </p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="max-w-md mx-auto bg-gray-900/50 backdrop-blur-sm rounded-lg p-8 border border-gray-800"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="reference" className="block text-sm font-medium text-white mb-2">
                Booking Reference
              </label>
              <div className="relative">
                <Input 
                  id="reference" 
                  placeholder="Enter your reference number"
                  value={reference}
                  onChange={(e) => setReference(e.target.value)}
                  className="bg-gray-800 border-gray-700 text-white pl-10"
                  disabled={isLoading}
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </div>
            
            <Button 
              type="submit" 
              className="w-full gold-gradient text-black hover:shadow-xl hover:shadow-gold/20 transition-all"
              disabled={isLoading}
            >
              {isLoading ? "Searching..." : "Track My Valet"}
            </Button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default TrackBooking;
