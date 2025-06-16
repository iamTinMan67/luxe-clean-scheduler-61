
import { Booking } from "@/types/booking";

interface BookingDetailsDisplayProps {
  bookingDetails: Booking | null;
}

const BookingDetailsDisplay = ({ bookingDetails }: BookingDetailsDisplayProps) => {
  if (!bookingDetails) return null;
  
  return (
    <div className="p-3 bg-black/30 rounded-md border border-gold/20 mt-4">
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div className="text-gold/70">Contact Details:</div>
        <div className="text-white font-medium">{bookingDetails.customer}</div>
        
        <div className="text-gold/70">Vehicle:</div>
        <div className="text-white font-medium">{bookingDetails.vehicle}</div>
        
        <div className="text-gold/70">Service:</div>
        <div className="text-white font-medium">{bookingDetails.packageType}</div>
        
        <div className="text-gold/70">Time:</div>
        <div className="text-white font-medium">{bookingDetails.time}</div>
        
        <div className="text-gold/70">Status:</div>
        <div className="text-white font-medium">{bookingDetails.status}</div>
      </div>
    </div>
  );
};

export default BookingDetailsDisplay;
