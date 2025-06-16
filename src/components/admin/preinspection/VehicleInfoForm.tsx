
import { useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Booking } from "@/types/booking";
import BookingSelector from "./BookingSelector";
import BookingDetailsDisplay from "./BookingDetailsDisplay";
import ConditionNotesForm from "./ConditionNotesForm";

interface VehicleInfoFormProps {
  appointments: Booking[];
  loading: boolean;
  selectedBooking: string;
  bookingDetails: Booking | null;
  exteriorNotes: string;
  interiorNotes: string;
  setSelectedBooking: (value: string) => void;
  setExteriorNotes: (value: string) => void;
  setInteriorNotes: (value: string) => void;
  showDeclineNotes: boolean;
  onBookingSelected: (booking: Booking) => void;
}

const VehicleInfoForm = ({
  appointments,
  loading,
  selectedBooking,
  bookingDetails,
  exteriorNotes,
  interiorNotes,
  setSelectedBooking,
  setExteriorNotes,
  setInteriorNotes,
  showDeclineNotes,
  onBookingSelected,
}: VehicleInfoFormProps) => {
  
  // Debug logging for filtered appointments
  useEffect(() => {
    console.log("=== Today's Appointments Debug ===");
    console.log("Total appointments:", appointments.length);
    console.log("Today's date:", new Date().toDateString());
  }, [appointments]);

  // Handle booking selection and trigger status update
  const handleBookingChange = (value: string) => {
    console.log("Booking selected:", value);
    setSelectedBooking(value);
    const selected = appointments.find(booking => booking.id === value);
    if (selected) {
      console.log("Selected booking details:", selected);
      onBookingSelected(selected);
    }
  };

  return (
    <Card className="bg-black/60 border-gold/30">
      <CardContent className="space-y-4 pt-6">
        <BookingSelector
          appointments={appointments}
          loading={loading}
          selectedBooking={selectedBooking}
          onBookingChange={handleBookingChange}
        />
        
        <BookingDetailsDisplay bookingDetails={bookingDetails} />
        
        <ConditionNotesForm
          showDeclineNotes={showDeclineNotes}
          exteriorNotes={exteriorNotes}
          interiorNotes={interiorNotes}
          setExteriorNotes={setExteriorNotes}
          setInteriorNotes={setInteriorNotes}
        />
      </CardContent>
    </Card>
  );
};

export default VehicleInfoForm;
