
import React from 'react';
import { Booking } from '@/types/booking';

interface BookingInfoProps {
  booking: Booking;
  estimatedDuration?: number;
}

const BookingInfo: React.FC<BookingInfoProps> = ({ booking, estimatedDuration = 0 }) => {
  const formatDuration = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours > 0 ? hours + 'h ' : ''}${mins > 0 ? mins + 'm' : hours === 0 ? '0m' : ''}`;
  };
  
  return (
    <div className="mb-4">
      <p className="text-gray-300">
        Booking for: <span className="text-white font-medium">{booking.customer}</span>
      </p>
      <p className="text-gray-300">
        Package: <span className="text-white">{booking.packageType}</span>
      </p>
      <p className="text-gray-300">
        Estimated service time: <span className="text-white font-medium">{formatDuration(estimatedDuration)}</span>
      </p>
    </div>
  );
};

export default BookingInfo;
