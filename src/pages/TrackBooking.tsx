
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import TrackingForm from "@/components/tracking/TrackingForm";

const TrackBooking = () => {
  const [reference, setReference] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { bookingId } = useParams();
  
  // If bookingId is provided in URL, verify and display the tracking form
  if (bookingId) {
    return <TrackingValidation bookingId={bookingId} />;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!reference.trim()) {
      toast.error("Please enter a booking reference");
      return;
    }
    
    setIsLoading(true);
    
    // Check if the booking exists in localStorage
    const confirmedBookingsStr = localStorage.getItem('confirmedBookings');
    const plannerBookingsStr = localStorage.getItem('plannerCalendarBookings');
    
    let found = false;
    let isValidStatus = false;
    
    try {
      // Check in confirmed bookings
      if (confirmedBookingsStr) {
        const confirmedBookings = JSON.parse(confirmedBookingsStr);
        const booking = confirmedBookings.find((booking: any) => booking.id === reference);
        
        if (booking) {
          found = true;
          // Only allow tracking if status is "inspected" or "in-progress"
          if (booking.status === "inspected" || booking.status === "in-progress") {
            isValidStatus = true;
          }
        }
      }
      
      // Check in planner bookings
      if (!found && plannerBookingsStr) {
        const plannerBookings = JSON.parse(plannerBookingsStr);
        const booking = plannerBookings.find((booking: any) => booking.id === reference);
        
        if (booking) {
          found = true;
          // Only allow tracking if status is "inspected" or "in-progress"
          if (booking.status === "inspected" || booking.status === "in-progress") {
            isValidStatus = true;
          }
        }
      }
      
      if (found && isValidStatus) {
        // Navigate to the progress page with the reference
        navigate(`/track/${reference}`);
      } else if (found) {
        toast.error("This booking cannot be tracked", {
          description: "Only bookings in the 'inspected' or 'in progress' state can be tracked."
        });
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

// Component to validate a booking ID from URL params
const TrackingValidation = ({ bookingId }: { bookingId: string }) => {
  const navigate = useNavigate();
  const [isValidBooking, setIsValidBooking] = useState<boolean | null>(null);
  
  useState(() => {
    // Validate the booking ID
    const validateBooking = () => {
      const confirmedBookingsStr = localStorage.getItem('confirmedBookings');
      const plannerBookingsStr = localStorage.getItem('plannerCalendarBookings');
      
      let found = false;
      let isValidStatus = false;
      
      try {
        // Check in confirmed bookings
        if (confirmedBookingsStr) {
          const confirmedBookings = JSON.parse(confirmedBookingsStr);
          const booking = confirmedBookings.find((booking: any) => booking.id === bookingId);
          
          if (booking) {
            found = true;
            // Only allow tracking if status is "inspected" or "in-progress"
            if (booking.status === "inspected" || booking.status === "in-progress") {
              isValidStatus = true;
            }
          }
        }
        
        // Check in planner bookings
        if (!found && plannerBookingsStr) {
          const plannerBookings = JSON.parse(plannerBookingsStr);
          const booking = plannerBookings.find((booking: any) => booking.id === bookingId);
          
          if (booking) {
            found = true;
            // Only allow tracking if status is "inspected" or "in-progress"
            if (booking.status === "inspected" || booking.status === "in-progress") {
              isValidStatus = true;
            }
          }
        }
        
        if (found && isValidStatus) {
          setIsValidBooking(true);
        } else {
          setIsValidBooking(false);
          setTimeout(() => {
            navigate("/track");
          }, 3000);
        }
      } catch (error) {
        console.error("Error validating booking:", error);
        setIsValidBooking(false);
        setTimeout(() => {
          navigate("/track");
        }, 3000);
      }
    };
    
    validateBooking();
  });
  
  if (isValidBooking === null) {
    return (
      <div className="min-h-screen bg-black text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-xl font-medium text-white">Validating booking...</h2>
        </div>
      </div>
    );
  }
  
  if (isValidBooking === false) {
    return (
      <div className="min-h-screen bg-black text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-xl font-medium text-white mb-2">Invalid Booking</h2>
          <p className="text-gray-400">The booking reference is invalid or cannot be tracked.</p>
          <p className="text-gray-400 mt-4">Redirecting to tracking page...</p>
        </div>
      </div>
    );
  }
  
  return <TrackingForm bookingId={bookingId} />;
};

export default TrackBooking;
