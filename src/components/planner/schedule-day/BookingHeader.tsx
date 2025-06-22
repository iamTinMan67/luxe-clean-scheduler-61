
import React from 'react';
import { Settings, Edit, Trash2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import RescheduleDialog from '../dialogs/RescheduleDialog';
import BookingStatusBadge from './BookingStatusBadge';
import { Booking } from '@/types/booking';

interface BookingHeaderProps {
  booking: Booking;
  onReschedule: (booking: Booking, newDate: Date, newTime?: string) => void;
  onDelete: (booking: Booking) => void;
}

const BookingHeader: React.FC<BookingHeaderProps> = ({ booking, onReschedule, onDelete }) => {
  return (
    <div className="flex justify-between items-start mb-2">
      <div className="flex-1">
        <h4 className="font-medium text-white text-lg">
          {booking.customer}
        </h4>
        <p className="text-gray-400 text-sm">ID: {booking.id}</p>
      </div>
      
      <div className="flex items-center gap-2">
        <BookingStatusBadge status={booking.status} />
        
        {booking.status === 'confirmed' && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="outline" 
                size="sm" 
                className="h-8 w-8 p-0 border-gold/50 bg-gold/10 hover:bg-gold/20 text-gold hover:text-gold"
              >
                <Settings className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-gray-800 border-gray-700">
              <RescheduleDialog 
                booking={booking}
                onReschedule={onReschedule}
                trigger={
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-blue-400 hover:text-blue-300 hover:bg-blue-900/20">
                    <Edit className="mr-2 h-4 w-4" />
                    Reschedule
                  </DropdownMenuItem>
                }
              />
              <DropdownMenuItem 
                onClick={() => onDelete(booking)}
                className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
  );
};

export default BookingHeader;
