
import React from 'react';
import { Clock } from 'lucide-react';
import { format } from "date-fns";

interface BookingDateTimeInfoProps {
  date: Date | string;
  time?: string;
  estimatedDuration: number;
}

const BookingDateTimeInfo: React.FC<BookingDateTimeInfoProps> = ({
  date,
  time,
  estimatedDuration
}) => {
  const formatDuration = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours > 0 ? hours + 'h ' : ''}${mins > 0 ? mins + 'm' : hours === 0 ? '0m' : ''}`;
  };

  return (
    <div className="flex items-center text-gray-300">
      <Clock className="w-4 h-4 mr-2 text-gold" />
      <span>
        {date instanceof Date 
          ? format(date, "MMM dd, yyyy") 
          : "Date not available"} 
        at {time || "Not specified"}
        {estimatedDuration > 0 && ` (Est. duration: ${formatDuration(estimatedDuration)})`}
      </span>
    </div>
  );
};

export default BookingDateTimeInfo;
