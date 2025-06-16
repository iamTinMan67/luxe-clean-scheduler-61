
import { useEffect } from "react";
import { useScheduledAppointments } from "@/hooks/useScheduledAppointments";
import { usePreInspectionState } from "@/hooks/preinspection/usePreInspectionState";
import { useImageUpload } from "@/hooks/preinspection/useImageUpload";
import { useBookingSelection } from "@/hooks/preinspection/useBookingSelection";
import { useReportSubmission } from "@/hooks/preinspection/useReportSubmission";
import { useServiceDecline } from "@/hooks/preinspection/useServiceDecline";
import { syncLocalStorageToSupabase } from "@/utils/dataSyncUtils";

export const usePreInspection = () => {
  const {
    images,
    setImages,
    selectedBooking,
    setSelectedBooking,
    bookingDetails,
    setBookingDetails,
    exteriorNotes,
    setExteriorNotes,
    interiorNotes,
    setInteriorNotes,
    isSubmitting,
    setIsSubmitting,
    showDeclineNotes,
    setShowDeclineNotes,
    initialBookingId
  } = usePreInspectionState();

  // Get appointments with enhanced filtering - only confirmed bookings for pre-inspection
  const { appointments, loading } = useScheduledAppointments(['confirmed']);
  
  const { handleImageUpload: uploadImage } = useImageUpload();
  const { updateBookingDetails, handleBookingSelected } = useBookingSelection();
  const { handleSubmitReport: submitReport } = useReportSubmission();
  const { handleDeclineService: declineService } = useServiceDecline();
  
  // Sync localStorage data to Supabase on component mount
  useEffect(() => {
    const syncData = async () => {
      try {
        await syncLocalStorageToSupabase();
      } catch (error) {
        console.error('Initial data sync failed:', error);
      }
    };
    
    syncData();
  }, []);
  
  // Enhanced debug logging for appointments
  console.log("=== usePreInspection Debug ===");
  console.log("Appointments received:", appointments.length);
  console.log("Loading state:", loading);
  console.log("Selected booking ID:", selectedBooking);
  console.log("Initial booking ID from URL:", initialBookingId);
  
  // Update booking details when a booking is selected
  const handleUpdateBookingDetails = () => {
    updateBookingDetails(selectedBooking, appointments, setBookingDetails);
  };
  
  // Placeholder function for image upload
  const handleImageUpload = () => {
    uploadImage(images, setImages);
  };

  // Handle report submission
  const handleSubmitReport = async () => {
    await submitReport(
      bookingDetails,
      images,
      exteriorNotes,
      interiorNotes,
      setIsSubmitting,
      setImages,
      setExteriorNotes,
      setInteriorNotes
    );
  };

  // Handle decline service
  const handleDeclineService = () => {
    declineService(
      showDeclineNotes,
      setShowDeclineNotes,
      bookingDetails,
      exteriorNotes,
      interiorNotes,
      images,
      setImages,
      setExteriorNotes,
      setInteriorNotes
    );
  };
  
  return {
    images,
    setImages,
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
    handleBookingSelected,
    handleImageUpload,
    handleSubmitReport,
    handleDeclineService,
    updateBookingDetails: handleUpdateBookingDetails
  };
};
