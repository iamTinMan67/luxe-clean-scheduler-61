import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useScheduledAppointments } from "@/hooks/useScheduledAppointments";
import VehicleInfoForm from "@/components/admin/preinspection/VehicleInfoForm";
import ImageUploadSection from "@/components/admin/preinspection/ImageUploadSection";
import InspectionChecklist from "@/components/admin/preinspection/InspectionChecklist";
import { submitPreInspectionReport } from "@/services/inspectionService";
import { Booking } from "@/types/booking";
import { useCustomerNotifications } from "@/hooks/progress/useCustomerNotifications";
import { sendTrackingInfo } from "@/utils/emailUtils";
import { bookingToProgressBooking } from "@/utils/bookingTypeAdapter";

const PreInspection = () => {
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

  // Handle decline service
  const handleDeclineService = () => {
    if (!bookingDetails) {
      toast.error("Please select a booking first");
      return;
    }
    
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
      
      // Redirect to planner
      navigate("/admin/planner-calendar");
    }
  };

  // Extract vehicle type from booking details
  const getVehicleType = (): string => {
    if (bookingDetails?.vehicle?.toLowerCase().includes('van')) {
      return 'van';
    }
    return 'car';
  };

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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="lg:col-span-1">
          <InspectionChecklist 
            onSubmitReport={handleSubmitReport} 
            onDeclineReport={handleDeclineService}
            vehicleType={getVehicleType()}
            isSubmitting={isSubmitting}
          />
        </div>
        
        <div className="lg:col-span-1 space-y-6">
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
      </div>
    </motion.div>
  );
};

export default PreInspection;
