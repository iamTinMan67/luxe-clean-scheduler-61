
import { useEffect } from "react";
import { useScheduledAppointments } from "@/hooks/useScheduledAppointments";
import { usePreInspectionState } from "@/hooks/preinspection/usePreInspectionState";
import { usePreInspectionFilters } from "@/hooks/preinspection/usePreInspectionFilters";
import { useImageUpload } from "@/hooks/preinspection/useImageUpload";
import { useBookingSelection } from "@/hooks/preinspection/useBookingSelection";
import { useReportSubmission } from "@/hooks/preinspection/useReportSubmission";
import { useServiceDecline } from "@/hooks/preinspection/useServiceDecline";
import { syncLocalStorageToSupabase } from "@/utils/dataSyncUtils";
import { Booking } from "@/types/booking";
import { isSameDay } from "@/utils/dateParsingUtils";

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

  const { selectedDate, setSelectedDate } = usePreInspectionFilters();

  // Get appointments with confirmed and inspecting status for pre-inspection
  const { appointments: allAppointments, loading } = useScheduledAppointments(['confirmed', 'inspecting']);
  
  // Filter appointments by selected date
  const appointments = allAppointments.filter(booking => {
    const bookingDate = booking.date instanceof Date ? booking.date : new Date(booking.date);
    return isSameDay(bookingDate, selectedDate);
  });

  const { handleImageUpload: uploadImage } = useImageUpload();
  const { updateBookingDetails, handleBookingSelected, handleStartInspection: startInspection } = useBookingSelection();
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
  console.log("All appointments received:", allAppointments.length);
  console.log("Filtered appointments for date:", appointments.length);
  console.log("Selected date:", selectedDate.toDateString());
  console.log("Loading state:", loading);
  console.log("Selected booking ID:", selectedBooking);
  console.log("Initial booking ID from URL:", initialBookingId);
  console.log("Booking details:", bookingDetails);
  
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

  // Handle start inspection
  const handleStartInspection = async () => {
    if (bookingDetails) {
      await startInspection(bookingDetails);
      // Refresh booking details to show updated status
      handleUpdateBookingDetails();
    }
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
    selectedDate,
    setSelectedDate,
    setSelectedBooking,
    setExteriorNotes,
    setInteriorNotes,
    handleBookingSelected,
    handleImageUpload,
    handleSubmitReport,
    handleDeclineService,
    handleStartInspection,
    updateBookingDetails: handleUpdateBookingDetails
  };
};
