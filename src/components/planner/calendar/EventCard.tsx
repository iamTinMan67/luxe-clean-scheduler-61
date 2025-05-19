
import React from 'react';
import { Booking } from '@/types/booking';
import { Badge } from '@/components/ui/badge';
import { Clock, MapPin, Car, Package } from 'lucide-react';
import NotificationButtons from './NotificationButtons';
import { getStatusInfo } from '@/utils/statusUtils';
import { formatTimeToAmPm } from '@/lib/utils';

interface EventCardProps {
  booking: Booking;
  onCompleteBooking: (booking: Booking) => void;
  onReschedule: (booking: Booking, date: Date) => void;
  onDeleteBooking: (booking: Booking) => void;
  onUpdateStatus?: (booking: Booking, newStatus: "confirmed" | "in-progress" | "completed" | "finished") => void;
  onPackageChange?: (booking: Booking, newPackage: string) => void;
}

const EventCard: React.FC<EventCardProps> = ({ 
  booking, 
  onCompleteBooking, 
  onReschedule, 
  onDeleteBooking,
  onUpdateStatus,
  onPackageChange
}) => {
  // Get status info for styling
  const statusInfo = getStatusInfo(booking.status);
  
  // Format start and end times
  const startTime = booking.startTime || booking.time || 'N/A';
  const endTime = booking.endTime || 'N/A';
  
  return (
    <div className={`mb-4 p-3 rounded-md ${statusInfo.color}`}>
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-medium text-white">{booking.customer}</h3>
          <div className="flex items-center gap-1 text-sm text-gray-300">
            <Package className="h-3 w-3" />
            {booking.packageType}
          </div>
          <div className="text-xs text-gray-400 mt-1 flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {formatTimeToAmPm(startTime)} - {formatTimeToAmPm(endTime)}
          </div>
          <div className="text-xs text-gray-400 flex items-center gap-1">
            <Car className="h-3 w-3" />
            {booking.vehicleReg || booking.vehicle || 'No vehicle info'}
          </div>
          <div className="text-xs text-gray-400 flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            {booking.location || 'No location info'}
          </div>
          {booking.notes && (
            <div className="mt-1 text-xs text-gray-400">
              <span className="font-semibold">Notes:</span> {booking.notes}
            </div>
          )}
        </div>
        <Badge className={`${
          booking.status === "confirmed" ? "bg-green-900/60 text-green-300" : 
          booking.status === "in-progress" ? "bg-blue-900/60 text-blue-300" :
          "bg-purple-900/60 text-purple-300"
        }`}>
          {booking.status}
        </Badge>
      </div>
      
      {booking.staff && booking.staff.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {booking.staff.map((staff, idx) => (
            <Badge key={idx} variant="outline" className="bg-blue-900/30 text-blue-300 border-blue-800">
              {staff}
            </Badge>
          ))}
        </div>
      )}
      
      <div className="mt-3">
        <NotificationButtons
          booking={booking}
          onCompleteBooking={onCompleteBooking}
          onReschedule={onReschedule}
          onDeleteBooking={onDeleteBooking}
          onUpdateStatus={onUpdateStatus}
          onPackageChange={onPackageChange}
        />
      </div>
    </div>
  );
};

export default EventCard;
