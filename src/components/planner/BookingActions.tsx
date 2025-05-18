
import React from 'react';
import { Button } from "@/components/ui/button";
import { 
  CheckCircle, 
  PlayCircle, 
  CheckSquare, 
  FileText
} from "lucide-react";
import { Booking } from '@/types/booking';
import { getStatusInfo } from '@/utils/statusUtils';

interface BookingActionsProps {
  booking: Booking;
  onConfirm: (booking: Booking) => void;
  onComplete: (booking: Booking) => void;
  onUpdateStatus: (booking: Booking, newStatus: "confirmed" | "in-progress" | "completed" | "finished") => void;
}

const BookingActions: React.FC<BookingActionsProps> = ({ 
  booking, 
  onConfirm, 
  onComplete,
  onUpdateStatus 
}) => {
  const statusInfo = getStatusInfo(booking.status);
  
  // If there's no next status, don't render any action buttons
  if (!statusInfo.nextStatus) {
    return null;
  }
  
  return (
    <div className="mt-3 flex flex-wrap gap-2">
      {statusInfo.nextStatus && (
        <Button 
          size="sm"
          className={`bg-${statusInfo.badgeColor} hover:bg-${statusInfo.badgeColor}/80 text-white`}
          onClick={() => onUpdateStatus(booking, statusInfo.nextStatus as any)}
        >
          {booking.status === "pending" && <CheckCircle className="h-4 w-4 mr-1" />}
          {booking.status === "confirmed" && <PlayCircle className="h-4 w-4 mr-1" />}
          {booking.status === "in-progress" && <CheckSquare className="h-4 w-4 mr-1" />}
          {booking.status === "completed" && <FileText className="h-4 w-4 mr-1" />}
          {statusInfo.nextLabel}
        </Button>
      )}
    </div>
  );
};

export default BookingActions;
