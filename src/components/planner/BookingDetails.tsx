
import React from 'react';
import { Booking } from '@/types/booking';

interface BookingDetailsProps {
  booking: Booking;
}

const BookingDetails: React.FC<BookingDetailsProps> = ({ booking }) => {
  return (
    <div className="space-y-1 text-sm">
      <p className="text-gray-300">Reference: <span className="text-white font-semibold">{booking.id}</span></p>
      <p className="text-gray-300">Vehicle: <span className="text-white">{booking.vehicle}</span></p>
      <p className="text-gray-300">Package: <span className="text-white">{booking.packageType}</span></p>
      <p className="text-gray-300">Location: <span className="text-white">{booking.location}</span></p>
      <p className="text-gray-300">Notes: <span className="text-white">{booking.notes}</span></p>
      <p className="text-gray-300">Status: 
        <span className={`ml-1 ${
          booking.status === "pending" ? "text-amber-400" : 
          booking.status === "confirmed" ? "text-blue-400" :
          booking.status === "completed" ? "text-green-400" : "text-white"
        }`}>{booking.status}</span>
      </p>
    </div>
  );
};

export default BookingDetails;
