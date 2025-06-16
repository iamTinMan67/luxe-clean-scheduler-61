
import { useState, useEffect } from "react";

interface UseBookingIdValidationReturn {
  isValid: boolean | null;
  isLoading: boolean;
}

export const useBookingIdValidation = (bookingId?: string): UseBookingIdValidationReturn => {
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!bookingId) {
      setIsValid(false);
      setIsLoading(false);
      return;
    }

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
        
        setIsValid(found && isValidStatus);
      } catch (error) {
        console.error("Error validating booking:", error);
        setIsValid(false);
      } finally {
        setIsLoading(false);
      }
    };

    validateBooking();
  }, [bookingId]);

  return { isValid, isLoading };
};
