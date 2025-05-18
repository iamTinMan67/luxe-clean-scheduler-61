
import React from 'react';
import { Booking } from '@/types/booking';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock } from 'lucide-react';

interface EventCardProps {
  booking: Booking;
  onCompleteBooking: (booking: Booking) => void;
  onReschedule: (booking: Booking, date: Date) => void;
  onDeleteBooking: (booking: Booking) => void;
}

const EventCard: React.FC<EventCardProps> = ({ 
  booking, 
  onCompleteBooking, 
  onReschedule, 
  onDeleteBooking 
}) => {
  return (
    <div className="mb-4 p-3 bg-green-900/30 border border-green-600/50 rounded-md">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-medium text-white">{booking.customer}</h3>
          <p className="text-sm text-gray-300">{booking.packageType}</p>
          <div className="text-xs text-gray-400 mt-1 flex items-center">
            <Clock className="h-3 w-3 mr-1" />
            {booking.startTime || booking.time} - {booking.endTime || 'N/A'}
          </div>
          {booking.vehicleReg && (
            <Badge variant="outline" className="mt-2">
              {booking.vehicleReg}
            </Badge>
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
      </div>
    </div>
  );
};

export default EventCard;
