
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useBookingIdValidation } from "@/hooks/tracking/useBookingIdValidation";
import TrackingForm from "./TrackingForm";

interface BookingValidationProps {
  bookingId: string;
}

const BookingValidation = ({ bookingId }: BookingValidationProps) => {
  const navigate = useNavigate();
  const { isValid, isLoading } = useBookingIdValidation(bookingId);
  
  useEffect(() => {
    if (isValid === false) {
      setTimeout(() => {
        navigate("/track");
      }, 3000);
    }
  }, [isValid, navigate]);
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-xl font-medium text-white">Validating booking...</h2>
        </div>
      </div>
    );
  }
  
  if (isValid === false) {
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
