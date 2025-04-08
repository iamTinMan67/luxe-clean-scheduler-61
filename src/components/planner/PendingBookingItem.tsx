
import React from 'react';
import { format } from "date-fns";
import { Booking } from '@/types/booking';
import { Button } from "@/components/ui/button";
import { 
  Car, Clock, MapPin, User, CheckCircle2, AlertCircle 
} from "lucide-react";

interface PendingBookingItemProps {
  booking: Booking;
  onConfirm: (bookingId: string) => void;
  onCancel: (bookingId: string) => void;
  getBookingBackground: (booking: Booking) => string;
}

const PendingBookingItem: React.FC<PendingBookingItemProps> = ({
  booking,
  onConfirm,
  onCancel,
  getBookingBackground
}) => {
  return (
    <div 
      key={booking.id}
      className={`rounded-lg p-4 border ${getBookingBackground(booking)}`}
    >
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-medium text-white">{booking.customer}</h3>
        <span className="text-xs text-gray-400">ID: {booking.id}</span>
      </div>
      
      <div className="space-y-2 mb-4">
        <div className="flex items-center text-gray-300">
          <Car className="w-4 h-4 mr-2 text-gold" />
          <span>
            {booking.vehicle} 
            {booking.vehicleReg && ` (${booking.vehicleReg})`} - 
            {booking.packageType} Package
          </span>
        </div>
        
        <div className="flex items-center text-gray-300">
          <Clock className="w-4 h-4 mr-2 text-gold" />
          <span>
            {booking.date instanceof Date 
              ? format(booking.date, "MMM dd, yyyy") 
              : "Date not available"} 
            at {booking.time || "Not specified"}
          </span>
        </div>
        
        <div className="flex items-center text-gray-300">
          <MapPin className="w-4 h-4 mr-2 text-gold" />
          <span>{booking.location}</span>
        </div>
        
        <div className="flex items-center text-gray-300">
          <User className="w-4 h-4 mr-2 text-gold" />
          <span>{booking.contact || booking.email || "No contact provided"}</span>
        </div>
        
        {/* Add vehicle condition indicator */}
        {booking.condition !== undefined && (
          <div className="flex items-center text-gray-300">
            <span className={`text-sm ${booking.condition < 5 ? "text-orange-400" : "text-green-400"}`}>
              Vehicle Condition: {booking.condition}/10
            </span>
          </div>
        )}
      </div>
      
      <div className="flex gap-2">
        <Button 
          onClick={() => onConfirm(booking.id)}
          className="flex-1 bg-green-600 hover:bg-green-700 text-white"
          size="sm"
        >
          <CheckCircle2 className="w-4 h-4 mr-1" /> Confirm
        </Button>
        
        <Button 
          onClick={() => onCancel(booking.id)}
          className="flex-1 bg-red-600 hover:bg-red-700 text-white"
          variant="destructive"
          size="sm"
        >
          <AlertCircle className="w-4 h-4 mr-1" /> Cancel
        </Button>
      </div>
    </div>
  );
};

export default PendingBookingItem;
