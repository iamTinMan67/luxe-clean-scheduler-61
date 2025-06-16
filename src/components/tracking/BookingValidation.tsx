
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TrackingForm from "./TrackingForm";

interface BookingValidationProps {
  bookingId: string;
}

const BookingValidation = ({ bookingId }: BookingValidationProps) => {
  const navigate = useNavigate();
  const [isValidBooking, setIsValidBooking] = useState<boolean | null>(null);
  
  useEffect(() => {
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
  }, [bookingId, navigate]);
  
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

export default BookingValidation;
