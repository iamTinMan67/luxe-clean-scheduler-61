
import { Booking } from "@/types/booking";

interface PendingConflictMessageProps {
  time: string;
  date: Date;
  appointments: Booking[];
}

const PendingConflictMessage = ({ time, date, appointments }: PendingConflictMessageProps) => {
  // Check if the selected time has a pending conflict
  const hasPendingConflict = appointments.some(booking => {
    if (booking.status !== 'pending') return false;
    
    const bookingDate = booking.date instanceof Date ? booking.date : new Date(booking.date);
    const datesMatch = 
      bookingDate.getDate() === date.getDate() &&
      bookingDate.getMonth() === date.getMonth() &&
      bookingDate.getFullYear() === date.getFullYear();
      
    if (!datesMatch) return false;
    
    const bookingTime = booking.time || booking.startTime;
    return bookingTime === time;
  });

  if (!hasPendingConflict) return null;

  return (
    <div className="mt-4 p-3 bg-green-900/20 border border-green-800 rounded-md text-sm">
      <p className="text-green-300">
        <strong>Pending Conflict:</strong> There is a pending booking for this time slot.
        You can still book this time, but it may cause a scheduling conflict if the other booking gets confirmed.
      </p>
    </div>
  );
};

export default PendingConflictMessage;
