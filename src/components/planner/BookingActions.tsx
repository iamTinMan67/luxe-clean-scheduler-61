
import React from 'react';
import { Button } from "@/components/ui/button";
import { 
  CheckCircle, 
  PlayCircle, 
  CheckSquare, 
  FileText, 
  ArrowRight 
} from "lucide-react";
import { Booking } from '@/types/booking';

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
  return (
    <div className="mt-3 flex flex-wrap gap-2">
      {/* Pending → Confirmed */}
      {booking.status === "pending" && (
        <Button 
          size="sm" 
          className="bg-green-600 hover:bg-green-700 text-white"
          onClick={() => onConfirm(booking)}
        >
          <CheckCircle className="h-4 w-4 mr-1" /> Confirm
        </Button>
      )}
      
      {/* Confirmed → In Progress (Pre-inspection completed) */}
      {booking.status === "confirmed" && (
        <Button 
          size="sm" 
          className="bg-blue-600 hover:bg-blue-700 text-white"
          onClick={() => onUpdateStatus(booking, "in-progress")}
        >
          <PlayCircle className="h-4 w-4 mr-1" /> Start Service
        </Button>
      )}
      
      {/* In Progress → Completed */}
      {booking.status === "in-progress" && (
        <Button 
          size="sm" 
          className="bg-purple-600 hover:bg-purple-700 text-white"
          onClick={() => onUpdateStatus(booking, "completed")}
        >
          <CheckSquare className="h-4 w-4 mr-1" /> Complete
        </Button>
      )}
      
      {/* Completed → Finished (Final stage) */}
      {booking.status === "completed" && (
        <Button 
          size="sm" 
          className="bg-gold hover:bg-gold/80 text-black"
          onClick={() => onUpdateStatus(booking, "finished")}
        >
          <FileText className="h-4 w-4 mr-1" /> Finalize
        </Button>
      )}
      
      {/* Show status progression indication */}
      {booking.status !== "pending" && booking.status !== "finished" && (
        <div className="text-xs text-gray-400 flex items-center ml-1">
          <span>{booking.status}</span>
          <ArrowRight className="h-3 w-3 mx-1" />
          <span>
            {booking.status === "confirmed" ? "in-progress" : 
             booking.status === "in-progress" ? "completed" : 
             booking.status === "completed" ? "finished" : ""}
          </span>
        </div>
      )}
    </div>
  );
};

export default BookingActions;
