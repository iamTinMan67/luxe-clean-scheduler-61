
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DatePicker } from "@/components/ui/date-picker";
import { Calendar } from "lucide-react";
import BookingSelector from "./BookingSelector";
import ConditionNotesForm from "./ConditionNotesForm";
import BookingDetailsDisplay from "./BookingDetailsDisplay";
import { Booking } from "@/types/booking";

interface VehicleInfoFormProps {
  appointments: Booking[];
  loading: boolean;
  selectedBooking: string;
  bookingDetails: Booking | null;
  exteriorNotes: string;
  interiorNotes: string;
  selectedDate: Date;
  setSelectedDate: (date: Date | undefined) => void;
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
  selectedDate,
  setSelectedDate,
  setSelectedBooking,
  setExteriorNotes,
  setInteriorNotes,
  showDeclineNotes,
  onBookingSelected
}: VehicleInfoFormProps) => {
  return (
    <Card className="bg-black/60 border-gold/30">
      <CardHeader>
        <CardTitle className="text-gold">Vehicle Information & Booking Selection</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Date Picker Section */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gold flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Select Date
          </label>
          <DatePicker
            date={selectedDate}
            onDateChange={setSelectedDate}
          />
          <p className="text-xs text-gray-400">
            Choose a date to filter appointments
          </p>
        </div>

        {/* Booking Selector */}
        <BookingSelector
          value={selectedBooking}
          onChange={setSelectedBooking}
          appointments={appointments}
          loading={loading}
          onBookingSelected={onBookingSelected}
        />
        
        {/* Booking Details Display */}
        <BookingDetailsDisplay bookingDetails={bookingDetails} />
        
        {/* Condition Notes Form */}
        {bookingDetails && (
          <ConditionNotesForm
            exteriorNotes={exteriorNotes}
            interiorNotes={interiorNotes}
            setExteriorNotes={setExteriorNotes}
            setInteriorNotes={setInteriorNotes}
            showDeclineNotes={showDeclineNotes}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default VehicleInfoForm;
