
import React from 'react';
import { format } from 'date-fns';
import { Booking, BookingStatus } from '@/types/booking';
import { Clock, MapPin, Phone, Mail, FileText, User, Car, Package, MoreVertical } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { getStatusInfo } from '@/utils/statusUtils';
import { useBookingStatusTransition } from '@/hooks/useBookingStatusTransition';

interface BookingCardProps {
  booking: Booking;
  variant?: 'default' | 'compact' | 'detailed';
  showActions?: boolean;
  onEdit?: (booking: Booking) => void;
  onDelete?: (booking: Booking) => void;
  className?: string;
}

const BookingCard: React.FC<BookingCardProps> = ({
  booking,
  variant = 'default',
  showActions = true,
  onEdit,
  onDelete,
  className = ''
}) => {
  const { transitionBookingStatus, isTransitioning } = useBookingStatusTransition();
  const statusInfo = getStatusInfo(booking.status as BookingStatus);
  const bookingDate = booking.date instanceof Date ? booking.date : new Date(booking.date);

  const handleStatusTransition = () => {
    if (statusInfo.nextStatus) {
      transitionBookingStatus(booking, statusInfo.nextStatus as BookingStatus);
    }
  };

  const renderCompactView = () => (
    <CardContent className="p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <User className="w-4 h-4 text-gray-400" />
          <span className="text-white font-medium">{booking.customer}</span>
        </div>
        <Badge variant="outline" className={`${statusInfo.color} border-current`}>
          {booking.status}
        </Badge>
      </div>
      
      <div className="flex items-center space-x-4 text-sm text-gray-400 mb-3">
        <div className="flex items-center space-x-1">
          <Clock className="w-3 h-3" />
          <span>{booking.time || booking.startTime}</span>
        </div>
        <div className="flex items-center space-x-1">
          <Car className="w-3 h-3" />
          <span>{booking.vehicle}</span>
        </div>
      </div>

      {showActions && (
        <div className="flex items-center justify-between">
          {statusInfo.nextStatus && (
            <Button
              size="sm"
              onClick={handleStatusTransition}
              disabled={isTransitioning}
              className="bg-yellow-600 hover:bg-yellow-700"
            >
              {statusInfo.actionLabel}
            </Button>
          )}
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {onEdit && (
                <DropdownMenuItem onClick={() => onEdit(booking)}>
                  Edit
                </DropdownMenuItem>
              )}
              {onDelete && (
                <DropdownMenuItem 
                  onClick={() => onDelete(booking)}
                  className="text-red-600"
                >
                  Delete
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
    </CardContent>
  );

  const renderDefaultView = () => (
    <CardContent className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <User className="w-5 h-5 text-gray-400" />
          <div>
            <h3 className="text-white font-semibold">{booking.customer}</h3>
            <p className="text-gray-400 text-sm">{format(bookingDate, 'MMM d, yyyy')}</p>
          </div>
        </div>
        <Badge variant="outline" className={`${statusInfo.color} border-current`}>
          {booking.status}
        </Badge>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex items-center space-x-2 text-sm">
          <Clock className="w-4 h-4 text-gray-400" />
          <span className="text-gray-300">{booking.time || booking.startTime}</span>
        </div>
        <div className="flex items-center space-x-2 text-sm">
          <Car className="w-4 h-4 text-gray-400" />
          <span className="text-gray-300">{booking.vehicle}</span>
        </div>
        <div className="flex items-center space-x-2 text-sm">
          <MapPin className="w-4 h-4 text-gray-400" />
          <span className="text-gray-300">{booking.location}</span>
        </div>
        <div className="flex items-center space-x-2 text-sm">
          <Package className="w-4 h-4 text-gray-400" />
          <span className="text-gray-300">{booking.packageType || booking.package}</span>
        </div>
      </div>

      {showActions && (
        <div className="flex items-center justify-between pt-4 border-t border-gray-800">
          {statusInfo.nextStatus && (
            <Button
              onClick={handleStatusTransition}
              disabled={isTransitioning}
              className="bg-yellow-600 hover:bg-yellow-700"
            >
              {statusInfo.actionLabel}
            </Button>
          )}
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {onEdit && (
                <DropdownMenuItem onClick={() => onEdit(booking)}>
                  Edit
                </DropdownMenuItem>
              )}
              {onDelete && (
                <DropdownMenuItem 
                  onClick={() => onDelete(booking)}
                  className="text-red-600"
                >
                  Delete
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
    </CardContent>
  );

  const renderDetailedView = () => (
    <CardContent className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <User className="w-6 h-6 text-gray-400" />
          <div>
            <h3 className="text-white font-bold text-lg">{booking.customer}</h3>
            <p className="text-gray-400">{format(bookingDate, 'EEEE, MMMM d, yyyy')}</p>
          </div>
        </div>
        <Badge variant="outline" className={`${statusInfo.color} border-current text-sm px-3 py-1`}>
          {booking.status}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <Clock className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-gray-400 text-sm">Time</p>
              <p className="text-white">{booking.time || booking.startTime}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Car className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-gray-400 text-sm">Vehicle</p>
              <p className="text-white">{booking.vehicle}</p>
              {booking.vehicleReg && (
                <p className="text-gray-400 text-xs">{booking.vehicleReg}</p>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <MapPin className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-gray-400 text-sm">Location</p>
              <p className="text-white">{booking.location}</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <Package className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-gray-400 text-sm">Package</p>
              <p className="text-white">{booking.packageType || booking.package}</p>
            </div>
          </div>
          {booking.contact && (
            <div className="flex items-center space-x-3">
              <Phone className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-gray-400 text-sm">Contact</p>
                <p className="text-white">{booking.contact}</p>
              </div>
            </div>
          )}
          {booking.email && (
            <div className="flex items-center space-x-3">
              <Mail className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-gray-400 text-sm">Email</p>
                <p className="text-white">{booking.email}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {booking.notes && (
        <div className="mb-6">
          <div className="flex items-center space-x-2 mb-2">
            <FileText className="w-4 h-4 text-gray-400" />
            <p className="text-gray-400 text-sm">Notes</p>
          </div>
          <p className="text-white bg-gray-800 p-3 rounded-lg">{booking.notes}</p>
        </div>
      )}

      {showActions && (
        <div className="flex items-center justify-between pt-6 border-t border-gray-800">
          {statusInfo.nextStatus && (
            <Button
              onClick={handleStatusTransition}
              disabled={isTransitioning}
              className="bg-yellow-600 hover:bg-yellow-700"
            >
              {statusInfo.actionLabel}
            </Button>
          )}
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {onEdit && (
                <DropdownMenuItem onClick={() => onEdit(booking)}>
                  Edit
                </DropdownMenuItem>
              )}
              {onDelete && (
                <DropdownMenuItem 
                  onClick={() => onDelete(booking)}
                  className="text-red-600"
                >
                  Delete
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
    </CardContent>
  );

  return (
    <Card className={`bg-gray-900 border-gray-800 ${className}`}>
      {variant === 'compact' && renderCompactView()}
      {variant === 'default' && renderDefaultView()}
      {variant === 'detailed' && renderDetailedView()}
    </Card>
  );
};

export default BookingCard;
