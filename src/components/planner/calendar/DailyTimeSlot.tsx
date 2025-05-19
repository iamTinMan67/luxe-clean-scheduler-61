
import React from 'react';
import { Booking } from '@/types/booking';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, MapPin, Car } from 'lucide-react';
import NotificationButtons from './NotificationButtons';
import { getStatusInfo } from '@/utils/statusUtils';
import { formatTimeToAmPm } from '@/lib/utils';

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
  // Get status info for styling
  const statusInfo = getStatusInfo(booking.status);
  
  // Use startTime if available, fallback to time, default to 08:00
  const startTime = booking.startTime || booking.time || '08:00';
  const [startHour, startMinute] = startTime.split(':').map(Number);
  const totalStartMinutes = startHour * 60 + startMinute;
  
  // Calculate position based on start time (8:00 = 0 minutes from start)
  const startPosition = totalStartMinutes - 8 * 60;
  
  // Calculate duration - use explicit duration if available or calculate from endTime or default to 60 minutes
  let durationMinutes = 60; // Default duration
  
  if (booking.duration) {
    // If duration is provided as a string, convert to number
    durationMinutes = parseInt(booking.duration);
  } else if (booking.endTime && booking.startTime) {
    // Calculate from end and start times if both are available
    const [endHour, endMinute] = booking.endTime.split(':').map(Number);
    const endTotalMinutes = endHour * 60 + endMinute;
    durationMinutes = endTotalMinutes - totalStartMinutes;
    
    // Ensure duration is at least 30 minutes if calculation results in negative or small value
    if (durationMinutes < 30) {
      durationMinutes = 60;
    }
  }
  
  return (
    <div className="flex items-center">
      <div className="min-w-[80px] text-gray-300 text-sm font-medium">
        {formatTimeToAmPm(startTime)}
      </div>
      <div className="flex-1 overflow-x-auto">
        <div className="relative min-w-max h-20" style={{ paddingLeft: `${(startPosition / 15) * 30}px` }}>
          <Card 
            className={`absolute top-0 ${statusInfo.color} hover:bg-opacity-70 transition-colors cursor-pointer`}
            style={{ width: `${durationMinutes * 2}px`, minWidth: '180px' }}
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
                <Badge className={`${statusInfo.badgeColor} ${statusInfo.textColor}`}>
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
