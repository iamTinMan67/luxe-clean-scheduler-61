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

  // [rest of the component unchanged]
  // Ensure you cast status values to BookingStatus where needed

  return (
    <Card className={`bg-gray-900 border-gray-800 ${className}`}>
      {variant === 'compact' && renderCompactView()}
      {variant === 'default' && renderDefaultView()}
      {variant === 'detailed' && renderDetailedView()}
    </Card>
  );
};

export default BookingCard;
