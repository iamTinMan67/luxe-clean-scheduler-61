
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Booking } from "@/types/booking";
import { submitPreInspectionReport } from "@/services/inspectionService";
import { sendTrackingInfo } from "@/utils/emailUtils";
import { useBookingStatus } from "@/hooks/bookings/useBookingStatus";
import { useBookingStateManager } from "@/hooks/bookings/useBookingStateManager";

export const useReportSubmission = () => {
  const navigate = useNavigate();
  const { updateBooking, moveBookingToConfirmed } = useBookingStateManager();
  const { updateBookingStatus } = useBookingStatus(updateBooking, moveBookingToConfirmed);

  const handleSubmitReport = async (
    bookingDetails: Booking | null,
    images: string[],
    exteriorNotes: string,
    interiorNotes: string,
    setIsSubmitting: (submitting: boolean) => void,
    setImages: (images: string[]) => void,
    setExteriorNotes: (notes: string) => void,
    setInteriorNotes: (notes: string) => void
  ) => {
    setIsSubmitting(true);
    
    try {
      if (!bookingDetails) {
        toast.error("Please select a booking first");
        setIsSubmitting(false);
        return;
      }
      
      // Ensure the booking status is set to inspected
      if (bookingDetails.status !== "inspected") {
        updateBookingStatus(bookingDetails, "inspected");
      }
      
      const success = await submitPreInspectionReport(
        bookingDetails,
        images,
        exteriorNotes,
        interiorNotes
      );
      
      if (success) {
        // Send report to customer via email
        if (bookingDetails.email) {
          sendTrackingInfo(bookingDetails);
        }
        
        // Reset form
        setImages([]);
        setExteriorNotes("");
        setInteriorNotes("");
        
        // Navigate to TodoList with the booking ID as parameter
        navigate(`/admin/todo-list?bookingId=${bookingDetails?.id}`);
      }
    } catch (error) {
      console.error("Error submitting report:", error);
      toast.error("Failed to submit inspection report");
    } finally {
      setIsSubmitting(false);
    }
  };

  return { handleSubmitReport };
};
