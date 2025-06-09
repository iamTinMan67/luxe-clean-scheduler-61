
import { Booking } from "@/types/booking";

interface TimeSlotGridProps {
  date: Date;
  time: string;
  appointments: Booking[];
  onTimeChange: (time: string) => void;
}

const TimeSlotGrid = ({ date, time, appointments, onTimeChange }: TimeSlotGridProps) => {
  const timeSlots = [
    "08:00", "09:00", "10:00", "11:00", "12:00",
    "13:00", "14:00", "15:00", "16:00", "17:00"
  ];

  // Check if a time slot is reserved by a CONFIRMED booking (should be hidden)
  const isTimeSlotReserved = (timeSlot: string) => {
    return appointments.some(booking => {
      // Only check confirmed bookings for reservations (not cancelled)
      if (booking.status !== 'confirmed' && 
          booking.status !== 'in-progress' && 
          booking.status !== 'finished' &&
          booking.status !== 'inspecting' &&
          booking.status !== 'inspected') {
        return false;
      }
      
      const bookingDate = booking.date instanceof Date ? booking.date : new Date(booking.date);
      
      // Check if dates match (same day, month, and year)
      const datesMatch = 
        bookingDate.getDate() === date.getDate() &&
        bookingDate.getMonth() === date.getMonth() &&
        bookingDate.getFullYear() === date.getFullYear();
        
      if (!datesMatch) return false;
      
      // Check if time matches directly
      const bookingTime = booking.time || booking.startTime;
      if (bookingTime === timeSlot) return true;
      
      // Check if time is within a range (for bookings with start and end times)
      if (booking.startTime && booking.endTime) {
        // Parse time slot hour
        const timeSlotHour = parseInt(timeSlot.split(':')[0]);
        const timeSlotMinute = parseInt(timeSlot.split(':')[1]);
        
        // Parse booking start time
        const startHour = parseInt(booking.startTime.split(':')[0]);
        const startMinute = parseInt(booking.startTime.split(':')[1]);
        
        // Parse booking end time
        const endHour = parseInt(booking.endTime.split(':')[0]);
        const endMinute = parseInt(booking.endTime.split(':')[1]);
        
        // Convert everything to minutes for easier comparison
        const timeSlotTotalMinutes = (timeSlotHour * 60) + timeSlotMinute;
        const startTotalMinutes = (startHour * 60) + startMinute;
        const endTotalMinutes = (endHour * 60) + endMinute;
        
        // Check if time slot falls within the booking's time range
        return timeSlotTotalMinutes >= startTotalMinutes && timeSlotTotalMinutes < endTotalMinutes;
      }
      
      return false;
    });
  };

  // Check if a time slot has a pending booking (shows in green with red dot)
  const hasPendingConflict = (timeSlot: string) => {
    return appointments.some(booking => {
      // Only check pending bookings for conflicts
      if (booking.status !== 'pending') {
        return false;
      }
      
      const bookingDate = booking.date instanceof Date ? booking.date : new Date(booking.date);
      
      // Check if dates match
      const datesMatch = 
        bookingDate.getDate() === date.getDate() &&
        bookingDate.getMonth() === date.getMonth() &&
        bookingDate.getFullYear() === date.getFullYear();
        
      if (!datesMatch) return false;
      
      // Check if time matches
      const bookingTime = booking.time || booking.startTime;
      return bookingTime === timeSlot;
    });
  };

  // Filter out reserved time slots - they won't be shown at all
  const availableTimeSlots = timeSlots.filter(slot => !isTimeSlotReserved(slot));

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
      {availableTimeSlots.map((slot) => {
        const pendingConflict = hasPendingConflict(slot);
        
        return (
          <button
            key={slot}
            type="button"
            onClick={() => onTimeChange(slot)}
            className={`py-2 px-3 rounded-md text-sm transition-colors ${
              time === slot
                ? pendingConflict
                  ? "bg-green-700 text-white" // Selected with pending conflict
                  : "gold-gradient text-black" // Normal selection
                : pendingConflict
                  ? "bg-green-900/40 text-green-300 hover:bg-green-800/60" // Pending conflict - green with red dot
                  : "bg-gray-800 text-white hover:bg-gray-700" // Available slot
            }`}
          >
            {slot}
            {pendingConflict && <span className="ml-2 text-red-400">●</span>}
          </button>
        );
      })}
    </div>
  );
};

export default TimeSlotGrid;
