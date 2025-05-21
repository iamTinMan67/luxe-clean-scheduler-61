
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
}: VehicleInfoFormProps) => {
  // Filter appointments to only show today's bookings
  const todayAppointments = appointments.filter(booking => {
    const bookingDate = booking.date instanceof Date ? booking.date : new Date(booking.date);
    const today = new Date();
    return (
      bookingDate.getDate() === today.getDate() &&
      bookingDate.getMonth() === today.getMonth() &&
      bookingDate.getFullYear() === today.getFullYear()
    );
  });

  // Display booking details if available
  const displayBookingInfo = () => {
    if (!bookingDetails) return null;
    
    return (
      <div className="p-3 bg-black/30 rounded-md border border-gold/20 mt-4">
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="text-gold/70">Customer:</div>
          <div className="text-white font-medium">{bookingDetails.customer}</div>
          
          <div className="text-gold/70">Vehicle:</div>
          <div className="text-white font-medium">{bookingDetails.vehicle}</div>
          
          <div className="text-gold/70">Service:</div>
          <div className="text-white font-medium">{bookingDetails.packageType}</div>
          
          <div className="text-gold/70">Time:</div>
          <div className="text-white font-medium">{bookingDetails.time}</div>
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
            Today's Appointments
          </label>
          <Select
            value={selectedBooking}
            onValueChange={(value) => setSelectedBooking(value)}
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
                <SelectItem value="none" disabled>No appointments scheduled for today</SelectItem>
              )}
            </SelectContent>
          </Select>
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
