
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import VehicleInfoForm from "@/components/admin/preinspection/VehicleInfoForm";
import ImageUploadSection from "@/components/admin/preinspection/ImageUploadSection";
import ActionButtons from "@/components/admin/preinspection/ActionButtons";
import { usePreInspection } from "@/hooks/usePreInspection";

const PreInspection = () => {
  const {
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
    handleSubmitReport,
    handleDeclineService,
    handleStartInspection,
    updateBookingDetails
  } = usePreInspection();
  
  // Update booking details when selection changes
  useEffect(() => {
    updateBookingDetails();
  }, [selectedBooking, appointments]);

  // Handle image updates from camera capture
  const handleImageUpdate = (newImages: string[]) => {
    setImages(newImages);
  };

  // Determine which buttons to show based on booking status
  const showStartInspection = bookingDetails && bookingDetails.status === "confirmed";
  const showInspectionComplete = bookingDetails && bookingDetails.status === "inspecting";

  console.log("PreInspection render state:", {
    selectedBooking,
    bookingDetails: bookingDetails ? {
      id: bookingDetails.id,
      customer: bookingDetails.customer,
      status: bookingDetails.status
    } : null,
    showStartInspection,
    showInspectionComplete,
    appointmentsCount: appointments.length,
    selectedDate: selectedDate.toDateString(),
    loading
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="container mx-auto py-8 px-4"
    >
      <div className="flex items-center mb-8">
        <Link 
          to="/admin/dashboard" 
          className="flex items-center space-x-2 text-yellow-400 hover:text-yellow-300 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Dashboard</span>
        </Link>
      </div>

      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-white mb-2">Pre-Inspection Report</h1>
        <p className="text-gold">Document the vehicle condition before commencement</p>
      </div>

      <div className="max-w-4xl mx-auto space-y-6">
        <VehicleInfoForm
          appointments={appointments}
          loading={loading}
          selectedBooking={selectedBooking}
          bookingDetails={bookingDetails}
          exteriorNotes={exteriorNotes}
          interiorNotes={interiorNotes}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          setSelectedBooking={setSelectedBooking}
          setExteriorNotes={setExteriorNotes}
          setInteriorNotes={setInteriorNotes}
          showDeclineNotes={showDeclineNotes}
          onBookingSelected={handleBookingSelected}
        />
        
        {/* Action buttons - show when booking is selected */}
        {bookingDetails && (
          <ActionButtons 
            isSubmitting={isSubmitting}
            onAccept={handleSubmitReport}
            onDecline={handleDeclineService}
            onStartInspection={handleStartInspection}
            showStartInspection={showStartInspection}
            showInspectionComplete={showInspectionComplete}
          />
        )}
        
        {/* Image upload section - only show when booking is inspecting */}
        {bookingDetails && bookingDetails.status === "inspecting" && (
          <div className="mt-6">
            <ImageUploadSection 
              images={images}
              onImageUpload={handleImageUpdate}
              bookingId={bookingDetails.id}
            />
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default PreInspection;
