
import React from 'react';
import { Booking } from '@/types/booking';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, MapPin, Car, Package } from 'lucide-react';

interface EventCardProps {
  booking: Booking;
  onCompleteBooking: (booking: Booking) => void;
  onReschedule: (booking: Booking, date: Date) => void;
  onDeleteBooking: (booking: Booking) => void;
  onPackageChange?: (booking: Booking, newPackage: string) => void;
}

const EventCard: React.FC<EventCardProps> = ({ 
  booking, 
  onCompleteBooking, 
  onReschedule, 
  onDeleteBooking,
  onPackageChange
}) => {
  return (
    <div className="mb-4 p-3 bg-green-900/30 border border-green-600/50 rounded-md">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-medium text-white">{booking.customer}</h3>
          <div className="flex items-center gap-1 text-sm text-gray-300">
            <Package className="h-3 w-3" />
            {booking.packageType}
          </div>
          <div className="text-xs text-gray-400 mt-1 flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {booking.startTime || booking.time} - {booking.endTime || 'N/A'}
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
      
      <div className="mt-3 flex flex-wrap gap-2">
        <Button 
          size="sm" 
          variant="outline" 
          className="bg-green-900/30 border-green-600/50 text-green-300 hover:bg-green-800/50"
          onClick={() => onCompleteBooking(booking)}
        >
          Complete
        </Button>
        <Button 
          size="sm" 
          variant="outline" 
          className="bg-blue-900/30 border-blue-600/50 text-blue-300 hover:bg-blue-800/50"
          onClick={() => onReschedule(booking, new Date(booking.date))}
        >
          Reschedule
        </Button>
        <Button 
          size="sm" 
          variant="outline" 
          className="bg-red-900/30 border-red-600/50 text-red-300 hover:bg-red-800/50"
          onClick={() => onDeleteBooking(booking)}
        >
          Delete
        </Button>
        {onPackageChange && (
          <Button 
            size="sm" 
            variant="outline" 
            className="bg-purple-900/30 border-purple-600/50 text-purple-300 hover:bg-purple-800/50"
            onClick={() => onPackageChange(booking, booking.packageType)}
          >
            Edit Package
          </Button>
        )}
      </div>
    </div>
  );
};

export default EventCard;
