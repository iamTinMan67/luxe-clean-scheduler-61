
import { useState } from "react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { useScheduledAppointments } from "@/hooks/useScheduledAppointments";
import { toast } from "sonner";

interface DateTimeSelectorProps {
  date: Date | undefined;
  time: string;
  onDateChange: (date: Date | undefined) => void;
  onTimeChange: (time: string) => void;
}

const DateTimeSelector = ({ 
  date, 
  time, 
  onDateChange, 
  onTimeChange 
}: DateTimeSelectorProps) => {
  // Generate time slots every 15 minutes between 8:00 and 17:00
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 8; hour <= 17; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        // Skip 17:15, 17:30, 17:45
        if (hour === 17 && minute > 0) continue;
        
        const formattedHour = hour.toString().padStart(2, '0');
        const formattedMinute = minute.toString().padStart(2, '0');
        slots.push(`${formattedHour}:${formattedMinute}`);
      }
    }
    return slots;
  };
  
  const timeSlots = generateTimeSlots();
  
  // Get all scheduled appointments
  const { appointments, loading } = useScheduledAppointments();
  
  // Check if a time slot is already reserved for the selected date
  const isTimeSlotReserved = (timeSlot: string) => {
    if (!date) return false;
    
    return appointments.some(booking => {
      const bookingDate = booking.date instanceof Date ? booking.date : new Date(booking.date);
      
      // Check if dates match (same day, month, and year)
      const datesMatch = 
        bookingDate.getDate() === date.getDate() &&
        bookingDate.getMonth() === date.getMonth() &&
        bookingDate.getFullYear() === date.getFullYear();
        
      if (!datesMatch) return false;
      
      // Only confirmed bookings should block time slots
      if (booking.status !== "confirmed") return false;
      
      // Check if time is directly at the slot
      const bookingStartTime = booking.startTime || booking.time;
      if (bookingStartTime === timeSlot) return true;
      
      // Check if the slot is within the booking's time range
      if (bookingStartTime) {
        // Parse time slot
        const [timeSlotHours, timeSlotMinutes] = timeSlot.split(':').map(Number);
        const timeSlotTotalMinutes = (timeSlotHours * 60) + timeSlotMinutes;
        
        // Parse booking start time
        const [startHours, startMinutes] = bookingStartTime.split(':').map(Number);
        const startTotalMinutes = (startHours * 60) + startMinutes;
        
        // Parse booking end time (or default to start time + 2 hours)
        let endTotalMinutes;
        if (booking.endTime) {
          const [endHours, endMinutes] = booking.endTime.split(':').map(Number);
          endTotalMinutes = (endHours * 60) + endMinutes;
        } else {
          // Default to 2 hours after start time
          endTotalMinutes = startTotalMinutes + 120;
        }
        
        // Factor in travel time before and after (if specified)
        const travelMinutesBefore = booking.travelMinutes || 0;
        const travelMinutesAfter = booking.travelMinutes || 0;
        
        const actualStartTime = startTotalMinutes - travelMinutesBefore;
        const actualEndTime = endTotalMinutes + travelMinutesAfter;
        
        // Check if time slot falls within the adjusted booking's time range
        return timeSlotTotalMinutes >= actualStartTime && timeSlotTotalMinutes < actualEndTime;
      }
      
      return false;
    });
  };

  // Function to check if a day has bookings
  const dayHasBookings = (checkDate: Date) => {
    return appointments.some(booking => {
      const bookingDate = booking.date instanceof Date ? booking.date : new Date(booking.date);
      return (
        bookingDate.getDate() === checkDate.getDate() &&
        bookingDate.getMonth() === checkDate.getMonth() &&
        bookingDate.getFullYear() === checkDate.getFullYear()
      );
    });
  };

  // Handle selecting a reserved time slot
  const handleReservedTimeClick = (reservedTimeSlot: string) => {
    // Find the conflicting booking
    const conflictingBooking = appointments.find(booking => {
      const bookingDate = booking.date instanceof Date ? booking.date : new Date(booking.date);
      const datesMatch = 
        date && 
        bookingDate.getDate() === date.getDate() &&
        bookingDate.getMonth() === date.getMonth() &&
        bookingDate.getFullYear() === date.getFullYear();
        
      if (!datesMatch) return false;
      
      const bookingTime = booking.time || booking.startTime;
      return bookingTime === reservedTimeSlot;
    });
    
    // Show a warning message
    toast.warning("This time slot is already booked.", {
      description: "Please select an available time slot."
    });
  };

  return (
    <>
      <div className="mb-6">
        <Calendar
          mode="single"
          selected={date}
          onSelect={onDateChange}
          className="bg-gray-900 border border-gray-800 rounded-md p-4"
          classNames={{
            day_selected: "bg-gold text-black",
            day_today: "bg-gray-800 text-white",
            // Fix: Use a string instead of a function for basic styling
            day: "text-white hover:bg-gray-800"
          }}
          modifiers={{
            // Use modifiers instead for conditional styling
            highlighted: (day) => dayHasBookings(day)
          }}
          modifiersClassNames={{
            highlighted: "font-bold"
          }}
          disabled={(date) => {
            // Disable past dates and Sundays
            const now = new Date();
            now.setHours(0, 0, 0, 0);
            return date < now || date.getDay() === 0;
          }}
        />
      </div>
      
      {date && (
        <div>
          <h3 className="text-lg font-medium text-white mb-3">
            Available Times for {format(date, "EEEE, MMMM d, yyyy")}
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {timeSlots.map((slot) => {
              const reserved = isTimeSlotReserved(slot);
              return (
                <button
                  key={slot}
                  type="button"
                  onClick={() => reserved ? handleReservedTimeClick(slot) : onTimeChange(slot)}
                  disabled={reserved}
                  className={`py-2 px-3 rounded-md text-sm transition-colors ${
                    time === slot
                      ? "gold-gradient text-black" 
                      : reserved 
                        ? "bg-red-900/40 text-gray-400 cursor-not-allowed" // Clearly show as unavailable
                        : "bg-gray-800 text-white hover:bg-gray-700" // Available slot
                  }`}
                >
                  {slot}
                  {reserved && <span className="ml-2 text-red-400">●</span>}
                </button>
              );
            })}
          </div>
          
          {time && isTimeSlotReserved(time) && (
            <div className="mt-4 p-3 bg-red-900/20 border border-red-800 rounded-md text-sm">
              <p className="text-red-300">
                <strong>Booking Conflict:</strong> This time slot already has a confirmed booking.
                Please select another available time.
              </p>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default DateTimeSelector;
