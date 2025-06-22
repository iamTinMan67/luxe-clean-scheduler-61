
import React from 'react';
import { Clock } from 'lucide-react';

interface BookingTimeInfoProps {
  startTime?: string;
  time?: string;
  endTime?: string;
}

const BookingTimeInfo: React.FC<BookingTimeInfoProps> = ({ startTime, time, endTime }) => {
  const displayStartTime = startTime || time || "09:00";
  const displayEndTime = endTime || "11:00";

  return (
    <div className="flex items-center text-gray-300 text-sm mb-3">
      <Clock className="w-4 h-4 mr-2 text-gold" />
      <span className="font-medium">{displayStartTime} - {displayEndTime}</span>
    </div>
  );
};

export default BookingTimeInfo;
