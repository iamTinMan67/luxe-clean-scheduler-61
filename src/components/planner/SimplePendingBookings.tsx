
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Booking } from "@/types/booking";
import { format } from "date-fns";
import { Check, X, Car, Calendar, Phone, MapPin } from "lucide-react";
import { toast } from "sonner";

interface SimplePendingBookingsProps {
  pendingBookings: Booking[];
  handleConfirmBooking: (bookingId: string, selectedStaff: string[], travelMinutes: number) => void;
  handleCancelBooking: (bookingId: string) => void;
}

const SimplePendingBookings: React.FC<SimplePendingBookingsProps> = ({
  pendingBookings,
  handleConfirmBooking,
  handleCancelBooking
}) => {
  // Quick confirm booking with default values
  const quickConfirmBooking = (booking: Booking) => {
    handleConfirmBooking(
      booking.id, 
      ['Default Staff'], // Default staff
      15 // Default travel time
    );
    
    toast.success("Booking Confirmed", {
      description: `${booking.customer}'s booking has been confirmed and added to the schedule.`,
    });
  };

  return (
    <Card className="bg-gray-900 border-gray-800">
      <CardHeader className="pb-2">
        <CardTitle className="text-white flex justify-between items-center">
          <span>Pending Bookings</span>
          <span className="bg-orange-700 text-sm text-white px-2 py-0.5 rounded-full">
            {pendingBookings.length} pending
          </span>
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        {pendingBookings.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {pendingBookings.map(booking => (
              <Card key={booking.id} className="bg-gray-800 border-gray-700">
                <CardContent className="p-4">
                  <div className="flex justify-between mb-2">
                    <h3 className="font-medium text-white">{booking.customer}</h3>
                    <span className="text-xs text-gray-400">ID: {booking.id.slice(0, 8)}</span>
                  </div>
                  
                  <div className="space-y-1 text-sm text-gray-300 mb-3">
                    <div className="flex items-center gap-2">
                      <Car className="h-4 w-4 text-gold" />
                      <span>{booking.vehicle || "Unknown vehicle"}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gold" />
                      <span>
                        {booking.date instanceof Date 
                          ? format(booking.date, "MMM dd, yyyy") 
                          : format(new Date(booking.date), "MMM dd, yyyy")} 
                        at {booking.time || booking.startTime || "09:00"}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gold" />
                      <span>{booking.location || "No location"}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gold" />
                      <span>{booking.contact || "No contact"}</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 mt-2">
                    <Button 
                      onClick={() => quickConfirmBooking(booking)} 
                      className="flex-1 bg-green-600 hover:bg-green-700"
                      size="sm"
                    >
                      <Check className="h-4 w-4 mr-1" /> Confirm
                    </Button>
                    <Button 
                      onClick={() => handleCancelBooking(booking.id)} 
                      className="flex-1 bg-red-600 hover:bg-red-700"
                      variant="destructive"
                      size="sm"
                    >
                      <X className="h-4 w-4 mr-1" /> Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-4 text-gray-500">
            No pending bookings
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SimplePendingBookings;
