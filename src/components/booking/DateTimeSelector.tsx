
import { useState } from "react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { useScheduledAppointments } from "@/hooks/useScheduledAppointments";

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
  const timeSlots = [
    "08:00", "09:00", "10:00", "11:00", "12:00",
    "13:00", "14:00", "15:00", "16:00", "17:00"
  ];
  
  // Get all scheduled appointments
  const { appointments, loading } = useScheduledAppointments();
  
  // Check if a time slot is reserved by a CONFIRMED booking
  const isTimeSlotReserved = (timeSlot: string) => {
    if (!date) return false;
    
    return appointments.some(booking => {
      // Only check confirmed bookings for reservations
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

  // Check if a time slot has a pending booking (shows as conflict warning)
  const hasPendingConflict = (timeSlot: string) => {
    if (!date) return false;
    
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

  // Function to check if a day has bookings
  const dayHasBookings = (checkDate: Date) => {
    return appointments.some(booking => {
      // Only show indicators for confirmed bookings
      if (booking.status !== 'confirmed' && 
          booking.status !== 'in-progress' && 
          booking.status !== 'finished' &&
          booking.status !== 'inspecting' &&
          booking.status !== 'inspected') {
        return false;
      }
      
      const bookingDate = booking.date instanceof Date ? booking.date : new Date(booking.date);
      return (
        bookingDate.getDate() === checkDate.getDate() &&
        bookingDate.getMonth() === checkDate.getMonth() &&
        bookingDate.getFullYear() === checkDate.getFullYear()
      );
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
            day: "text-white hover:bg-gray-800"
          }}
          modifiers={{
            highlighted: (day) => dayHasBookings(day)
          }}
          modifiersClassNames={{
            highlighted: "font-bold text-gold"
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
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {timeSlots.map((slot) => {
              const reserved = isTimeSlotReserved(slot);
              const pendingConflict = hasPendingConflict(slot);
              
              return (
                <button
                  key={slot}
                  type="button"
                  onClick={() => !reserved && onTimeChange(slot)}
                  disabled={reserved}
                  className={`py-2 px-3 rounded-md text-sm transition-colors ${
                    time === slot
                      ? pendingConflict
                        ? "bg-yellow-700 text-white" // Selected with pending conflict
                        : "gold-gradient text-black" // Normal selection
                      : reserved 
                        ? "bg-red-900/40 text-gray-500 cursor-not-allowed" // Reserved (unavailable)
                        : pendingConflict
                          ? "bg-yellow-900/40 text-yellow-300 hover:bg-yellow-800/60" // Pending conflict warning
                          : "bg-gray-800 text-white hover:bg-gray-700" // Available slot
                  }`}
                >
                  {slot}
                  {reserved && <span className="ml-2 text-red-400">●</span>}
                  {!reserved && pendingConflict && <span className="ml-2 text-yellow-400">⚠</span>}
                </button>
              );
            })}
          </div>
          
          {time && (
            <div className="mt-4">
              {isTimeSlotReserved(time) && (
                <div className="p-3 bg-red-900/20 border border-red-800 rounded-md text-sm">
                  <p className="text-red-300">
                    <strong>Time Unavailable:</strong> This time slot is already reserved by a confirmed booking.
                    Please select a different time.
                  </p>
                </div>
              )}
              
              {!isTimeSlotReserved(time) && hasPendingConflict(time) && (
                <div className="p-3 bg-yellow-900/20 border border-yellow-800 rounded-md text-sm">
                  <p className="text-yellow-300">
                    <strong>Pending Conflict:</strong> There is a pending booking for this time slot.
                    You can still book this time, but it may cause a scheduling conflict if the other booking gets confirmed.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default DateTimeSelector;
