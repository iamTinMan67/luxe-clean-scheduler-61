
import React from 'react';
import { 
  Car, Clock, MapPin, User, Mail, Phone, Package 
} from "lucide-react";
import { format } from "date-fns";
import { Booking } from '@/types/booking';
import { packageOptions } from "@/data/servicePackageData";
import { formatDuration } from "@/lib/utils";

interface BookingMetadataProps {
  booking: Booking;
  estimatedDuration?: number;
  showMinimal?: boolean;
}

const BookingMetadata: React.FC<BookingMetadataProps> = ({ 
  booking, 
  estimatedDuration = 0,
  showMinimal = false 
}) => {
  // Get package details
  const packageDetail = packageOptions.find(p => p.type === booking.packageType);

  if (showMinimal) {
    return (
      <div className="space-y-2 mb-3">
        <div className="flex items-center text-gray-300">
          <Car className="w-4 h-4 mr-2 text-gold" />
          <span>{booking.vehicle}</span>
        </div>
        
        <div className="flex items-center text-gray-300">
          <Clock className="w-4 h-4 mr-2 text-gold" />
          <span>
            {booking.date instanceof Date 
              ? format(booking.date, "MMM dd, yyyy") 
              : "Date not available"} at {booking.time || "Not specified"}
          </span>
        </div>
        
        <div className="flex items-center text-gray-300">
          <MapPin className="w-4 h-4 mr-2 text-gold" />
          <span>{booking.location}</span>
        </div>
        
        <div className="flex items-center text-gray-300">
          <Package className="w-4 h-4 mr-2 text-gold" />
          <span>{booking.packageType} Package</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2 mb-4">
      <div className="flex items-center text-gray-300">
        <Car className="w-4 h-4 mr-2 text-gold" />
        <span>
          {booking.vehicle} 
          {booking.vehicleReg && ` (${booking.vehicleReg})`}
        </span>
      </div>

      <div className="flex items-center text-gray-300">
        <Package className="w-4 h-4 mr-2 text-gold" />
        <span>
          {packageDetail ? 
            `${booking.packageType} Package (£${packageDetail.basePrice})` : 
            `${booking.packageType} Package`}
        </span>
      </div>
      
      <div className="flex items-center text-gray-300">
        <Clock className="w-4 h-4 mr-2 text-gold" />
        <span>
          {booking.date instanceof Date 
            ? format(booking.date, "MMM dd, yyyy") 
            : "Date not available"} 
          at {booking.time || "Not specified"}
          {estimatedDuration > 0 && ` (Est. duration: ${formatDuration(estimatedDuration)})`}
        </span>
      </div>
      
      <div className="flex items-center text-gray-300">
        <MapPin className="w-4 h-4 mr-2 text-gold" />
        <span>{booking.location}</span>
      </div>

      <div className="flex items-center text-gray-300">
        <User className="w-4 h-4 mr-2 text-gold" />
        <span>{booking.notes || "No notes provided"}</span>
      </div>
      
      <div className="flex items-center text-gray-300">
        <Mail className="w-4 h-4 mr-2 text-gold" />
        <span>{booking.email || "No email provided"}</span>
      </div>
      
      <div className="flex items-center text-gray-300">
        <Phone className="w-4 h-4 mr-2 text-gold" />
        <span>{booking.contact || "No phone provided"}</span>
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
  );
};

export default BookingMetadata;
