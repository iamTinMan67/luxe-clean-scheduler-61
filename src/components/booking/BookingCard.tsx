import React from 'react';
import { format } from 'date-fns';
import { Booking } from '@/types/booking';
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
  const statusInfo = getStatusInfo(booking.status);
  const bookingDate = booking.date instanceof Date ? booking.date : new Date(booking.date);

  const handleStatusTransition = () => {
    if (statusInfo.nextStatus) {
      transitionBookingStatus(booking, statusInfo.nextStatus);
    }
  };

  const renderCompactView = () => (
    <div className="flex items-center justify-between p-3">
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <h4 className="font-medium text-white">{booking.customer}</h4>
          <Badge variant="outline" className={`${statusInfo.textColor} border-current`}>
            {statusInfo.label}
          </Badge>
        </div>
        <p className="text-sm text-gray-400">{booking.vehicle}</p>
        <p className="text-xs text-gray-500">{format(bookingDate, "MMM d, yyyy")} at {booking.time}</p>
      </div>
      {showActions && statusInfo.nextStatus && (
        <Button
          size="sm"
          onClick={handleStatusTransition}
          disabled={isTransitioning}
          className="ml-2"
        >
          {statusInfo.nextLabel}
        </Button>
      )}
    </div>
  );

  const renderDefaultView = () => (
    <CardContent className="p-4">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="text-lg font-semibold text-white">{booking.customer}</h3>
          <p className="text-sm text-gray-400">ID: {booking.id}</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className={`${statusInfo.textColor} border-current`}>
            {statusInfo.label}
          </Badge>
          {showActions && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-400">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-gray-800 border-gray-700">
                {onEdit && (
                  <DropdownMenuItem onClick={() => onEdit(booking)} className="text-white hover:bg-gray-700">
                    Edit Booking
                  </DropdownMenuItem>
                )}
                {onDelete && (
                  <DropdownMenuItem onClick={() => onDelete(booking)} className="text-red-400 hover:bg-gray-700">
                    Delete Booking
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
        <div className="flex items-center gap-2 text-sm text-gray-300">
          <Clock className="h-4 w-4 text-gold" />
          <span>{format(bookingDate, "MMM d, yyyy")} at {booking.time}</span>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-gray-300">
          <Car className="h-4 w-4 text-gold" />
          <span>{booking.vehicle}</span>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-300">
          <MapPin className="h-4 w-4 text-gold" />
          <span>{booking.location}</span>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-300">
          <Package className="h-4 w-4 text-gold" />
          <span>{booking.packageType} Package</span>
        </div>

        {booking.contact && (
          <div className="flex items-center gap-2 text-sm text-gray-300">
            <Phone className="h-4 w-4 text-gold" />
            <span>{booking.contact}</span>
          </div>
        )}

        {booking.email && (
          <div className="flex items-center gap-2 text-sm text-gray-300">
            <Mail className="h-4 w-4 text-gold" />
            <span>{booking.email}</span>
          </div>
        )}
      </div>

      {booking.notes && (
        <div className="mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-300">
            <FileText className="h-4 w-4 text-gold" />
            <span className="font-medium">Notes:</span>
          </div>
          <p className="text-sm text-gray-400 mt-1 pl-6">{booking.notes}</p>
        </div>
      )}

      {booking.staff && booking.staff.length > 0 && (
        <div className="mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-300 mb-2">
            <User className="h-4 w-4 text-gold" />
            <span className="font-medium">Assigned Staff:</span>
          </div>
          <div className="flex flex-wrap gap-1 pl-6">
            {booking.staff.map((staff, idx) => (
              <Badge key={idx} variant="secondary" className="text-xs">
                {staff}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {showActions && statusInfo.nextStatus && (
        <div className="flex justify-end">
          <Button
            onClick={handleStatusTransition}
            disabled={isTransitioning}
            className="bg-gold hover:bg-gold/90 text-black"
          >
            {statusInfo.nextLabel}
          </Button>
        </div>
      )}
    </CardContent>
  );

  const renderDetailedView = () => (
    <CardContent className="p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-2xl font-bold text-white">{booking.customer}</h3>
          <p className="text-sm text-gray-400">Booking ID: {booking.id}</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className={`${statusInfo.textColor} border-current`}>
            {statusInfo.label}
          </Badge>
          {showActions && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-400">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-gray-800 border-gray-700">
                {onEdit && (
                  <DropdownMenuItem onClick={() => onEdit(booking)} className="text-white hover:bg-gray-700">
                    Edit Booking
                  </DropdownMenuItem>
                )}
                {onDelete && (
                  <DropdownMenuItem onClick={() => onDelete(booking)} className="text-red-400 hover:bg-gray-700">
                    Delete Booking
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="flex items-center gap-2 text-sm text-gray-300">
          <Clock className="h-4 w-4 text-gold" />
          <span>{format(bookingDate, "MMM d, yyyy")} at {booking.time}</span>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-gray-300">
          <Car className="h-4 w-4 text-gold" />
          <span>{booking.vehicle || "No vehicle info"}</span>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-300">
          <MapPin className="h-4 w-4 text-gold" />
          <span>{booking.location || "No location specified"}</span>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-300">
          <Package className="h-4 w-4 text-gold" />
          <span>{booking.packageType || "Standard"} Package</span>
        </div>

        {booking.contact && (
          <div className="flex items-center gap-2 text-sm text-gray-300">
            <Phone className="h-4 w-4 text-gold" />
            <span>{booking.contact}</span>
          </div>
        )}

        {booking.email && (
          <div className="flex items-center gap-2 text-sm text-gray-300">
            <Mail className="h-4 w-4 text-gold" />
            <span>{booking.email}</span>
          </div>
        )}
      </div>

      {booking.notes && (
        <div className="mb-6">
          <div className="flex items-center gap-2 text-sm text-gray-300">
            <FileText className="h-4 w-4 text-gold" />
            <span className="font-medium">Notes:</span>
          </div>
          <p className="text-sm text-gray-400 mt-1 pl-6">{booking.notes}</p>
        </div>
      )}

      {booking.staff && booking.staff.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center gap-2 text-sm text-gray-300 mb-2">
            <User className="h-4 w-4 text-gold" />
            <span className="font-medium">Assigned Staff:</span>
          </div>
          <div className="flex flex-wrap gap-1 pl-6">
            {booking.staff.map((staff, idx) => (
              <Badge key={idx} variant="secondary" className="text-xs">
                {staff}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {showActions && statusInfo.nextStatus && (
        <div className="flex justify-end">
          <Button
            onClick={handleStatusTransition}
            disabled={isTransitioning}
            className="bg-gold hover:bg-gold/90 text-black"
          >
            {statusInfo.nextLabel}
          </Button>
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
