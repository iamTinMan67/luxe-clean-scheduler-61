
import React from 'react';
import { Booking } from '@/types/booking';
import { MapPin, Clock, Car, Package, FileText } from 'lucide-react';
import BookingContactDetails from '../booking-item/BookingContactDetails';

interface PendingBookingContentProps {
  booking: Booking;
  estimatedDuration?: number;
}

const PendingBookingContent: React.FC<PendingBookingContentProps> = ({
  booking,
  estimatedDuration
}) => {
  return (
    <div className="space-y-3">
      {/* Customer Information - No duplicate client type badge here */}
      <div className="flex items-center space-x-2">
        <span className="text-white font-medium text-lg">{booking.customer}</span>
      </div>
      
      {/* Date and Time - No package duration displayed */}
      <div className="flex items-center space-x-2">
        <Clock className="w-4 h-4 text-gray-400" />
        <span className="text-gray-300">
          {booking.date instanceof Date 
            ? booking.date.toLocaleDateString() 
            : new Date(booking.date).toLocaleDateString()} at {booking.time}
        </span>
      </div>
      
      {/* Location */}
      <div className="flex items-center space-x-2">
        <MapPin className="w-4 h-4 text-gray-400" />
        <span className="text-gray-300">{booking.location}</span>
      </div>
      
      {/* Vehicle and Package Information */}
      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center space-x-2">
          <Car className="w-4 h-4 text-gray-400" />
          <span className="text-gray-300">{booking.vehicle}</span>
        </div>
        <div className="flex items-center space-x-2">
          <Package className="w-4 h-4 text-gray-400" />
          <span className="text-gray-300">{booking.packageType}</span>
        </div>
      </div>
      
      {/* Notes */}
      {booking.notes && (
        <div className="flex items-start space-x-2 mt-3">
          <FileText className="w-4 h-4 text-gray-400 mt-0.5" />
          <div className="text-gray-300 text-sm">
            <span className="font-medium">Notes: </span>
            {booking.notes}
          </div>
        </div>
      )}

      {/* Collapsible Contact Details */}
      <BookingContactDetails
        customer={booking.customer}
        location={booking.location}
        email={booking.email}
        contact={booking.contact}
        clientType={booking.clientType}
      />
    </div>
  );
};

export default PendingBookingContent;
