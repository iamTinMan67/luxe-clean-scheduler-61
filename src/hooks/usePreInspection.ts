
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { Booking, validateBookingStatus } from "@/types/booking";
import { submitPreInspectionReport } from "@/services/inspectionService";
import { useCustomerNotifications } from "@/hooks/progress/useCustomerNotifications";
import { sendTrackingInfo } from "@/utils/emailUtils";
import { bookingToProgressBooking } from "@/utils/bookingTypeAdapter";
import { useScheduledAppointments } from "@/hooks/useScheduledAppointments";

export const usePreInspection = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialBookingId = searchParams.get('bookingId') || '';
  const { sendTextReport } = useCustomerNotifications();
  
  const [images, setImages] = useState<string[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<string>(initialBookingId);
  const [bookingDetails, setBookingDetails] = useState<Booking | null>(null);
  const [exteriorNotes, setExteriorNotes] = useState("");
  const [interiorNotes, setInteriorNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDeclineNotes, setShowDeclineNotes] = useState(false);
  const { appointments, loading } = useScheduledAppointments();
  
  // Update booking details when a booking is selected
  useEffect(() => {
    if (selectedBooking) {
      const selected = appointments.find(booking => booking.id === selectedBooking);
      if (selected) {
        setBookingDetails(selected);
      }
    } else {
      setBookingDetails(null);
    }
  }, [selectedBooking, appointments]);

  // Placeholder function for image upload
  const handleImageUpload = () => {
    // In a real app, this would upload to a server
    // For now, we'll just add a placeholder image
    setImages([...images, "https://placeholder.pics/svg/300x200/DEDEDE/555555/Vehicle%20Image"]);
  };

  // Handle report submission
  const handleSubmitReport = async () => {
    setIsSubmitting(true);
    
    try {
      if (!bookingDetails) {
        toast.error("Please select a booking first");
        setIsSubmitting(false);
        return;
      }
      
      // Update the booking status to "inspected" with proper typing
      const updatedBooking = {
        ...bookingDetails,
        status: validateBookingStatus("inspected")
      };
      
      const success = await submitPreInspectionReport(
        updatedBooking,
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

  // Handle decline service
  const handleDeclineService = () => {
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

  return {
    images,
    selectedBooking,
    bookingDetails,
    exteriorNotes,
    interiorNotes,
    isSubmitting,
    showDeclineNotes,
    appointments,
    loading,
    setSelectedBooking,
    setExteriorNotes,
    setInteriorNotes,
    handleImageUpload,
    handleSubmitReport,
    handleDeclineService
  };
};
