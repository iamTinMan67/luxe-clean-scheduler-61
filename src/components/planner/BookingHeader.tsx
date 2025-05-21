
import React from 'react';
import { MoreVertical, Package } from 'lucide-react';
import { Booking } from '@/types/booking';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import DeleteBookingDialog from './dialogs/DeleteBookingDialog';
import EditPackageDialog from './dialogs/EditPackageDialog';
import RescheduleDialog from './dialogs/RescheduleDialog';

interface BookingHeaderProps {
  booking: Booking;
  onDelete: (booking: Booking) => void;
  onPackageChange: (booking: Booking, newPackage: string) => void;
  onReschedule: (booking: Booking, newDate: Date, newTime?: string) => void;
}

const BookingHeader: React.FC<BookingHeaderProps> = ({ 
  booking, 
  onDelete, 
  onPackageChange, 
  onReschedule 
}) => {
  return (
    <div className="flex justify-between items-start mb-2">
      <div>
        <div className="flex items-center space-x-2">
          <h3 className="text-base font-semibold text-white">
            {booking.customer}
          </h3>
        </div>
        <div className="flex items-center mt-1 text-xs text-gray-400">
          <Package className="w-3 h-3 mr-1" />
          <span className="capitalize">{booking.packageType} Package</span>
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <RescheduleDialog booking={booking} onReschedule={onReschedule} />
        
        <EditPackageDialog booking={booking} onPackageChange={onPackageChange} />
        
        <DeleteBookingDialog booking={booking} onDelete={onDelete} />
        
        <DropdownMenu>
          <DropdownMenuTrigger className="flex h-8 w-8 items-center justify-center rounded-md border border-gray-700 bg-transparent">
            <MoreVertical className="h-4 w-4 text-gray-400" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-gray-950 border-gray-800">
            <DropdownMenuItem className="text-gray-300 focus:text-white focus:bg-gray-800">
              Send Reminder
            </DropdownMenuItem>
            <DropdownMenuItem className="text-gray-300 focus:text-white focus:bg-gray-800">
              View Details
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default BookingHeader;
