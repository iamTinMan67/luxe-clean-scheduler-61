
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "@/components/ui/use-toast";
import { useScheduledAppointments } from "@/hooks/useScheduledAppointments";
import VehicleInfoForm from "@/components/admin/preinspection/VehicleInfoForm";
import ImageUploadSection from "@/components/admin/preinspection/ImageUploadSection";
import InspectionChecklist from "@/components/admin/preinspection/InspectionChecklist";
import { submitPreInspectionReport } from "@/services/inspectionService";
import { Booking } from "@/types/booking";

const PreInspection = () => {
  const [images, setImages] = useState<string[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<string>("");
  const [bookingDetails, setBookingDetails] = useState<Booking | null>(null);
  const [exteriorNotes, setExteriorNotes] = useState("");
  const [interiorNotes, setInteriorNotes] = useState("");
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
  const handleSubmitReport = () => {
    const success = submitPreInspectionReport(
      bookingDetails,
      images,
      exteriorNotes,
      interiorNotes
    );
    
    if (success) {
      // Reset form
      setImages([]);
      setExteriorNotes("");
      setInteriorNotes("");
      setSelectedBooking("");
      setBookingDetails(null);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="container mx-auto py-8 px-4"
    >
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Pre-Inspection Report</h1>
        <p className="text-gold">Document the vehicle condition before commencement</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
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
          />
          
          <ImageUploadSection 
            images={images}
            onImageUpload={handleImageUpload}
          />
        </div>
        
        <div className="lg:col-span-1">
          <InspectionChecklist onSubmitReport={handleSubmitReport} />
        </div>
      </div>
    </motion.div>
  );
};

export default PreInspection;
