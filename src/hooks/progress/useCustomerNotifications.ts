
import { toast } from "sonner";
import { ProgressBooking } from "./types";
import { Booking } from "@/types/booking";
import { bookingToProgressBooking } from "@/utils/bookingTypeAdapter";

export const useCustomerNotifications = () => {
  // Function to send text report to customer
  const sendTextReport = (booking: ProgressBooking) => {
    // In a real app, this would use an SMS API service
    console.log("Sending text report to customer:", booking.customerName);
    toast.success("Text report sent to customer", {
      description: `A completion report has been sent to ${booking.customerName}`
    });
  };
  
  // Function to send completion and feedback request
  const sendCompletionSMS = (booking: ProgressBooking) => {
    // This would be implemented with a real SMS service
    console.log(`Sending completion SMS to ${booking.customerName}`);
    
    // Generate feedback URL with the invoice ID
    const feedbackUrl = `/feedback/${booking.id}`;
    
    toast.success("Thank you message sent", {
      description: `A thank you message with feedback request has been sent to ${booking.customerName}`
    });
  };

  return {
    sendTextReport,
    sendCompletionSMS
  };
};
