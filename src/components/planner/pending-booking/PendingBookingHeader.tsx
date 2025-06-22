
import React from 'react';
import { Booking } from '@/types/booking';
import ClientTypeBadge from './ClientTypeBadge';

interface PendingBookingHeaderProps {
  booking: Booking;
}

const PendingBookingHeader: React.FC<PendingBookingHeaderProps> = ({ booking }) => {
  return (
    <div className="flex justify-between items-start mb-3">
      {/* Only show booking ID if status is not pending */}
      {booking.status !== 'pending' && (
        <span className="text-xs text-gray-400">ID: {booking.id}</span>
      )}
      
      {/* Client Category in top right corner - this is the only instance */}
      <ClientTypeBadge clientType={booking.clientType} />
    </div>
  );
};

export default PendingBookingHeader;
