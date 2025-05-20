
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
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { sendEmail, generateEmailTemplate } from "@/utils/emailUtils";
import { sendNotification } from "@/utils/bookingUtils";

const PreInspection = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialBookingId = searchParams.get('bookingId') || '';
  
  const [images, setImages] = useState<string[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<string>(initialBookingId);
  const [bookingDetails, setBookingDetails] = useState<Booking | null>(null);
  const [exteriorNotes, setExteriorNotes] = useState("");
  const [interiorNotes, setInteriorNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { appointments, loading } = useScheduledAppointments();
  
  // Decline booking state
  const [isDeclineDialogOpen, setIsDeclineDialogOpen] = useState(false);
  const [sendEmailNotification, setSendEmailNotification] = useState(false);
  const [sendSmsNotification, setSendSmsNotification] = useState(false);
  const [declineReason, setDeclineReason] = useState("");

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
      const success = await submitPreInspectionReport(
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

  // Extract vehicle type from booking details
  const getVehicleType = (): string => {
    if (bookingDetails?.vehicle?.toLowerCase().includes('van')) {
      return 'van';
    }
    return 'car';
  };

  // Handle declining the booking
  const handleDeclineBooking = async () => {
    if (!bookingDetails) {
      toast.error("No booking selected");
      return;
    }
    
    try {
      // Update the booking status to cancelled in a real app
      // For demo purposes, we'll just show a success message
      
      // Send email notification if selected
      if (sendEmailNotification && bookingDetails.email) {
        const emailTemplate = generateEmailTemplate(bookingDetails, "update");
        await sendEmail(bookingDetails.email, {
          subject: "Your Booking Has Been Cancelled",
          body: `Dear ${bookingDetails.customer},\n\nWe regret to inform you that your booking (ID: ${bookingDetails.id}) has been cancelled.\n\nReason: ${declineReason || "Unable to provide service at this time"}\n\nPlease contact us if you have any questions.\n\nRegards,\nThe Luxe Clean Team`
        });
      }
      
      // Send SMS notification if selected
      if (sendSmsNotification) {
        sendNotification(bookingDetails, "update");
      }
      
      // Show success toast
      toast.success("Booking cancelled successfully", {
        description: "The customer has been notified"
      });
      
      // Reset form and navigate back
      setImages([]);
      setExteriorNotes("");
      setInteriorNotes("");
      setIsDeclineDialogOpen(false);
      
      // Navigate back to the calendar
      navigate("/admin/planner-calendar");
      
    } catch (error) {
      console.error("Error declining booking:", error);
      toast.error("Failed to cancel booking");
    }
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
          <InspectionChecklist 
            onSubmitReport={handleSubmitReport} 
            vehicleType={getVehicleType()}
            isSubmitting={isSubmitting}
          />
          
          {/* Add Decline Button */}
          <div className="mt-6 text-center">
            <Button 
              variant="destructive" 
              onClick={() => setIsDeclineDialogOpen(true)} 
              disabled={!bookingDetails || isSubmitting}
              className="w-full"
            >
              Decline Booking
            </Button>
          </div>
        </div>
      </div>
      
      {/* Decline Booking Dialog */}
      <AlertDialog open={isDeclineDialogOpen} onOpenChange={setIsDeclineDialogOpen}>
        <AlertDialogContent className="bg-gray-900 border border-gold/30 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl">Decline Booking</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-300">
              This will cancel the booking and notify the customer. Please select notification method(s).
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="send-email" 
                checked={sendEmailNotification}
                onCheckedChange={(checked) => setSendEmailNotification(!!checked)}
              />
              <label htmlFor="send-email" className="text-sm font-medium leading-none cursor-pointer text-white">
                Send email notification
              </label>
            </div>
            
            {sendEmailNotification && bookingDetails?.email && (
              <div className="ml-6 p-2 bg-gray-800 rounded text-sm">
                <p>Email will be sent to: <span className="font-semibold text-gold">{bookingDetails.email}</span></p>
              </div>
            )}
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="send-sms" 
                checked={sendSmsNotification}
                onCheckedChange={(checked) => setSendSmsNotification(!!checked)}
              />
              <label htmlFor="send-sms" className="text-sm font-medium leading-none cursor-pointer text-white">
                Send SMS notification
              </label>
            </div>
            
            {sendSmsNotification && bookingDetails?.contact && (
              <div className="ml-6 p-2 bg-gray-800 rounded text-sm">
                <p>SMS will be sent to: <span className="font-semibold text-gold">{bookingDetails.contact}</span></p>
              </div>
            )}
            
            <div className="pt-2">
              <label htmlFor="decline-reason" className="text-sm font-medium mb-1 block text-white">
                Reason for declining (optional)
              </label>
              <textarea 
                id="decline-reason"
                className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white text-sm"
                rows={3}
                value={declineReason}
                onChange={(e) => setDeclineReason(e.target.value)}
                placeholder="Enter reason for declining this booking"
              />
            </div>
          </div>
          
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-gray-800 text-white hover:bg-gray-700">Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeclineBooking} 
              className="bg-red-600 text-white hover:bg-red-700"
              disabled={!sendEmailNotification && !sendSmsNotification}
            >
              Decline Booking
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  );
};

export default PreInspection;
