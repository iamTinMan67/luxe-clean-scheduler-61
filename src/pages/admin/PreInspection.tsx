
import { motion } from "framer-motion";
import VehicleInfoForm from "@/components/admin/preinspection/VehicleInfoForm";
import ImageUploadSection from "@/components/admin/preinspection/ImageUploadSection";
import ActionButtons from "@/components/admin/preinspection/ActionButtons";
import { usePreInspection } from "@/hooks/usePreInspection";

const PreInspection = () => {
  const {
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
  } = usePreInspection();
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="container mx-auto py-8 px-4"
    >
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
          setSelectedBooking={setSelectedBooking}
          setExteriorNotes={setExteriorNotes}
          setInteriorNotes={setInteriorNotes}
          showDeclineNotes={showDeclineNotes}
        />
        
        {/* Accept and Decline buttons component */}
        <ActionButtons 
          isSubmitting={isSubmitting}
          handleSubmitReport={handleSubmitReport}
          handleDeclineService={handleDeclineService}
        />
        
        <div className="mt-6">
          <ImageUploadSection 
            images={images}
            onImageUpload={handleImageUpload}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default PreInspection;
