
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { Booking } from "@/types/booking";

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
  
  // Enhanced date comparison for today's bookings
  const getTodayString = () => {
    const today = new Date();
    return today.toDateString();
  };

  const isSameDay = (date1: Date | string, date2: Date) => {
    const d1 = date1 instanceof Date ? date1 : new Date(date1);
    const d2 = date2;
    return d1.toDateString() === d2.toDateString();
  };

  // Filter appointments with enhanced logic and debugging
  const todayAppointments = appointments.filter(booking => {
    console.log("Processing booking:", {
      id: booking.id,
      customer: booking.customer,
      date: booking.date,
      status: booking.status,
      dateType: typeof booking.date,
      dateString: booking.date instanceof Date ? booking.date.toDateString() : new Date(booking.date).toDateString()
    });

    const bookingDate = booking.date instanceof Date ? booking.date : new Date(booking.date);
    const today = new Date();
    
    const isToday = isSameDay(bookingDate, today);
    const isConfirmed = booking.status === "confirmed";
    
    console.log("Booking filter check:", {
      id: booking.id,
      isToday,
      isConfirmed,
      shouldInclude: isToday && isConfirmed
    });

    return isToday && isConfirmed;
  });

  // Debug logging for filtered appointments
  useEffect(() => {
    console.log("=== Today's Appointments Debug ===");
    console.log("Total appointments:", appointments.length);
    console.log("Today's confirmed appointments:", todayAppointments.length);
    console.log("Today's date:", getTodayString());
    console.log("Filtered appointments:", todayAppointments.map(booking => ({
      id: booking.id,
      customer: booking.customer,
      status: booking.status,
      date: booking.date instanceof Date ? booking.date.toDateString() : new Date(booking.date).toDateString()
    })));
  }, [appointments, todayAppointments]);

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

  // Display booking details if available
  const displayBookingInfo = () => {
    if (!bookingDetails) return null;
    
    return (
      <div className="p-3 bg-black/30 rounded-md border border-gold/20 mt-4">
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="text-gold/70">Contact Details:</div>
          <div className="text-white font-medium">{bookingDetails.customer}</div>
          
          <div className="text-gold/70">Vehicle:</div>
          <div className="text-white font-medium">{bookingDetails.vehicle}</div>
          
          <div className="text-gold/70">Service:</div>
          <div className="text-white font-medium">{bookingDetails.packageType}</div>
          
          <div className="text-gold/70">Time:</div>
          <div className="text-white font-medium">{bookingDetails.time}</div>
          
          <div className="text-gold/70">Status:</div>
          <div className="text-white font-medium">{bookingDetails.status}</div>
        </div>
      </div>
    );
  };

  return (
    <Card className="bg-black/60 border-gold/30">
      <CardHeader>
        <CardTitle className="text-white">Vehicle Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label htmlFor="customer" className="text-white text-sm font-medium block mb-1">
            Today's Appointments ({getTodayString()})
          </label>
          <Select
            value={selectedBooking}
            onValueChange={handleBookingChange}
          >
            <SelectTrigger className="bg-black/40 border-gold/30 text-white">
              <SelectValue placeholder="Select today's appointment" />
            </SelectTrigger>
            <SelectContent className="bg-gray-900 border-gold/30 text-white">
              {loading ? (
                <SelectItem value="loading" disabled>Loading appointments...</SelectItem>
              ) : todayAppointments.length > 0 ? (
                todayAppointments.map((booking) => (
                  <SelectItem key={booking.id} value={booking.id}>
                    {booking.customer} - {booking.time} - {booking.packageType}
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="none" disabled>
                  No confirmed appointments scheduled for today
                </SelectItem>
              )}
            </SelectContent>
          </Select>
          
          {/* Debug information - only shown in development */}
          {process.env.NODE_ENV === 'development' && (
            <div className="mt-2 text-xs text-gray-400">
              Debug: {appointments.length} total, {todayAppointments.length} today confirmed
            </div>
          )}
        </div>
        
        {/* Display booking info when selected */}
        {displayBookingInfo()}
        
        {/* Condition text fields based on showDeclineNotes */}
        {showDeclineNotes && (
          <>
            <div>
              <label htmlFor="exteriorNotes" className="text-white text-sm font-medium block mb-1">
                Exterior Condition Issues (Reason for decline)
              </label>
              <Textarea 
                id="exteriorNotes" 
                className="bg-black/40 border-gold/30 text-white min-h-[100px]" 
                placeholder="Note any existing damage, scratches, dents, etc."
                value={exteriorNotes}
                onChange={(e) => setExteriorNotes(e.target.value)}
              />
            </div>
            
            <div>
              <label htmlFor="interiorNotes" className="text-white text-sm font-medium block mb-1">
                Interior Condition Issues (Reason for decline)
              </label>
              <Textarea 
                id="interiorNotes" 
                className="bg-black/40 border-gold/30 text-white min-h-[100px]" 
                placeholder="Note any dog hairs, stains, wear, etc."
                value={interiorNotes}
                onChange={(e) => setInteriorNotes(e.target.value)}
              />
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default VehicleInfoForm;
