
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Booking } from "@/types/booking";
import { useCustomerNotifications } from "@/hooks/progress/useCustomerNotifications";
import { sendTrackingInfo } from "@/utils/emailUtils";
import { bookingToProgressBooking } from "@/utils/bookingTypeAdapter";

export const useServiceDecline = () => {
  const navigate = useNavigate();
  const { sendTextReport } = useCustomerNotifications();

  const handleDeclineService = (
    showDeclineNotes: boolean,
    setShowDeclineNotes: (show: boolean) => void,
    bookingDetails: Booking | null,
    exteriorNotes: string,
    interiorNotes: string,
    images: string[],
    setImages: (images: string[]) => void,
    setExteriorNotes: (notes: string) => void,
    setInteriorNotes: (notes: string) => void
  ) => {
    if (!showDeclineNotes) {
      setShowDeclineNotes(true);
      return;
    }
    
    if (!bookingDetails) {
      toast.error("Please select a booking first");
      return;
    }
    
    if (exteriorNotes.trim() === "" && interiorNotes.trim() === "") {
      toast.error("Please provide a reason for declining the service");
      return;
    }
    
    // Store the declined job report
    const declinedJob = {
      id: bookingDetails.id,
      customer: bookingDetails.customer,
      vehicle: bookingDetails.vehicle,
      date: bookingDetails.date,
      time: bookingDetails.time,
      images: images,
      exteriorNotes: exteriorNotes,
      interiorNotes: interiorNotes,
      declinedAt: new Date(),
      reason: exteriorNotes + "\n" + interiorNotes
    };
    
    // Save to localStorage (in a real app, this would go to Supabase)
    const declinedJobs = localStorage.getItem('declinedJobs') 
      ? JSON.parse(localStorage.getItem('declinedJobs') || '[]') 
      : [];
    localStorage.setItem('declinedJobs', JSON.stringify([...declinedJobs, declinedJob]));
    
    // Send notification to customer
    if (bookingDetails) {
      // Convert Booking to ProgressBooking before sending to sendTextReport
      const progressBooking = bookingToProgressBooking(bookingDetails);
      
      // Send text notification
      sendTextReport(progressBooking);
      
      // Send email notification if email is available
      if (bookingDetails.email) {
        sendTrackingInfo(bookingDetails);
      }
      
      // Reset form
      setImages([]);
      setExteriorNotes("");
      setInteriorNotes("");
      setShowDeclineNotes(false);
      
      toast.success("Job declined and customer notified");
      
      // Redirect to planner
      navigate("/admin/planner-calendar");
    }
  };

  return { handleDeclineService };
};
