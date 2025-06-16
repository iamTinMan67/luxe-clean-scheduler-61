
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Booking } from "@/types/booking";
import { submitPreInspectionReport } from "@/services/inspectionService";
import { sendTrackingInfo } from "@/utils/emailUtils";
import { useBookingStateManager } from "@/hooks/bookings/useBookingStateManager";
import { syncBookingToSupabase } from "@/services/bookingSyncService";

export const useReportSubmission = () => {
  const navigate = useNavigate();
  const { updateBooking } = useBookingStateManager();

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
      
      // Submit the inspection report first - this will handle the status update to "inspected"
      const success = await submitPreInspectionReport(
        bookingDetails,
        images,
        exteriorNotes,
        interiorNotes
      );
      
      if (success) {
        // FIXED: Get the updated booking with "inspected" status set by the inspection service
        const updatedBooking: Booking = {
          ...bookingDetails,
          status: "inspected" // Ensure status is set to "inspected" for ToDo list compatibility
        };
        
        // Update status locally
        await updateBooking(updatedBooking);
        
        // Sync the status change to Supabase (with error handling for UUID issues)
        try {
          await syncBookingToSupabase(updatedBooking);
          console.log('Status change synced to database');
        } catch (error) {
          console.error('Failed to sync status change to database:', error);
          // Continue execution - localStorage update is sufficient for now
        }
        
        toast.success(`${bookingDetails.customer}'s inspection completed. Booking is ready for service tasks.`);
        
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
