
import React from 'react';
import { Booking } from '@/types/booking';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface DailyTimeSlotProps {
  booking: Booking;
}

const DailyTimeSlot: React.FC<DailyTimeSlotProps> = ({ booking }) => {
  const startTime = booking.startTime || booking.time || '08:00';
  const [startHour, startMinute] = startTime.split(':').map(Number);
  const totalStartMinutes = startHour * 60 + startMinute;
  
  // Calculate position based on start time (8:00 = 0 minutes from start)
  const startPosition = totalStartMinutes - 8 * 60;
  // Default to 60 minutes duration
  const duration = 60;
  
  return (
    <div className="flex items-center">
      <div className="min-w-[80px] text-gray-300 text-sm font-medium">
        {startTime}
      </div>
      <div className="flex-1 overflow-x-auto">
        <div className="relative min-w-max h-16" style={{ paddingLeft: `${(startPosition / 15) * 30}px` }}>
          <Card 
            className="absolute top-0 bg-green-900/40 border-green-700/50"
            style={{ width: `${duration * 2}px`, minWidth: '120px' }}
          >
            <CardContent className="p-2">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="font-semibold text-white truncate">{booking.customer}</div>
                  <div className="text-xs text-gray-300 truncate">{booking.packageType}</div>
                </div>
                <Badge className={`${
                  booking.status === "confirmed" ? "bg-green-900/60 text-green-300" : 
                  booking.status === "in-progress" ? "bg-blue-900/60 text-blue-300" :
                  "bg-purple-900/60 text-purple-300"
                }`}>
                  {booking.status}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DailyTimeSlot;
