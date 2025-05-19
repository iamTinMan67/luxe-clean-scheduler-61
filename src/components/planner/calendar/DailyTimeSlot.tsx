
import React from 'react';
import { Booking } from '@/types/booking';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, MapPin, Car } from 'lucide-react';
import NotificationButtons from './NotificationButtons';

interface DailyTimeSlotProps {
  booking: Booking;
  onCompleteBooking?: (booking: Booking) => void;
  onReschedule?: (booking: Booking, newDate: Date) => void;
  onDeleteBooking?: (booking: Booking) => void;
  onUpdateStatus?: (booking: Booking, newStatus: "confirmed" | "in-progress" | "completed" | "finished") => void;
  onPackageChange?: (booking: Booking, newPackage: string) => void;
}

const DailyTimeSlot: React.FC<DailyTimeSlotProps> = ({ 
  booking,
  onCompleteBooking,
  onReschedule,
  onDeleteBooking,
  onUpdateStatus,
  onPackageChange
}) => {
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
        <div className="relative min-w-max h-20" style={{ paddingLeft: `${(startPosition / 15) * 30}px` }}>
          <Card 
            className="absolute top-0 bg-green-900/40 border-green-700/50 hover:bg-green-900/60 transition-colors cursor-pointer"
            style={{ width: `${duration * 2}px`, minWidth: '180px' }}
          >
            <CardContent className="p-2">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="font-semibold text-white truncate">{booking.customer}</div>
                  <div className="text-xs text-gray-300 truncate flex items-center gap-1">
                    <Car className="h-3 w-3" /> {booking.vehicle || booking.vehicleReg || 'No vehicle info'}
                  </div>
                  <div className="text-xs text-gray-300 truncate flex items-center gap-1">
                    <MapPin className="h-3 w-3" /> {booking.location || 'No location info'}
                  </div>
                </div>
                <Badge className={`${
                  booking.status === "confirmed" ? "bg-green-900/60 text-green-300" : 
                  booking.status === "in-progress" ? "bg-blue-900/60 text-blue-300" :
                  "bg-purple-900/60 text-purple-300"
                }`}>
                  {booking.status}
                </Badge>
              </div>
              
              <NotificationButtons
                booking={booking}
                onCompleteBooking={onCompleteBooking}
                onReschedule={onReschedule}
                onDeleteBooking={onDeleteBooking}
                onUpdateStatus={onUpdateStatus}
                onPackageChange={onPackageChange}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DailyTimeSlot;
