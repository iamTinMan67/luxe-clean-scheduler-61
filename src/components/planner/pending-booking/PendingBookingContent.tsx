
import React from 'react';
import { Booking } from '@/types/booking';
import { MapPin, Clock, User, Car, Package, Phone, Mail, FileText } from 'lucide-react';
import ClientTypeBadge from './ClientTypeBadge';

interface PendingBookingContentProps {
  booking: Booking;
}

const PendingBookingContent: React.FC<PendingBookingContentProps> = ({
  booking
}) => {
  return (
    <div className="space-y-3">
      {/* Customer Information */}
      <div className="flex items-center space-x-2">
        <User className="w-4 h-4 text-gray-400" />
        <span className="text-white font-medium">{booking.customer}</span>
        <ClientTypeBadge booking={booking} />
      </div>
      
      {/* Date and Time */}
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
      
      {/* Contact Information */}
      <div className="space-y-1">
        {booking.contact && (
          <div className="flex items-center space-x-2">
            <Phone className="w-4 h-4 text-gray-400" />
            <span className="text-gray-300 text-sm">{booking.contact}</span>
          </div>
        )}
        {booking.email && (
          <div className="flex items-center space-x-2">
            <Mail className="w-4 h-4 text-gray-400" />
            <span className="text-gray-300 text-sm">{booking.email}</span>
          </div>
        )}
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
    </div>
  );
};

export default PendingBookingContent;
