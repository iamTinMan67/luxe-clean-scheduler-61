
import React from 'react';
import { Booking } from '@/types/booking';
import { Clock, Car, Package, FileText } from 'lucide-react';
import BookingContactDetails from '../booking-item/BookingContactDetails';
import ClientTypeBadge from './ClientTypeBadge';

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
      {/* Line 1: Job Category Icon */}
      <div className="flex items-center">
        <ClientTypeBadge clientType={booking.clientType} />
      </div>
      
      {/* Line 2: Date and Time */}
      <div className="flex items-center space-x-2">
        <Clock className="w-4 h-4 text-gray-400" />
        <span className="text-gray-300">
          {booking.date instanceof Date 
            ? booking.date.toLocaleDateString() 
            : new Date(booking.date).toLocaleDateString()} at {booking.time}
        </span>
      </div>
      
      {/* Line 3: Vehicle Type */}
      <div className="flex items-center space-x-2">
        <Car className="w-4 h-4 text-gray-400" />
        <span className="text-gray-300">{booking.vehicle}</span>
      </div>
      
      {/* Line 4: Package Selected */}
      <div className="flex items-center space-x-2">
        <Package className="w-4 h-4 text-gray-400" />
        <span className="text-gray-300">{booking.packageType}</span>
      </div>
      
      {/* Line 5: Notes */}
      {booking.notes && (
        <div className="flex items-start space-x-2">
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
