
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
              return (
                <button
                  key={slot}
                  type="button"
                  disabled={reserved}
                  className={`py-2 px-3 rounded-md text-sm transition-colors ${
                    time === slot
                      ? "gold-gradient text-black"
                      : reserved 
                        ? "bg-gray-600/40 text-gray-400 cursor-not-allowed"
                        : "bg-gray-800 text-white hover:bg-gray-700"
                  }`}
                  onClick={() => !reserved && onTimeChange(slot)}
                >
                  {slot}
                  {reserved && <span className="ml-2">●</span>}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
};

export default DateTimeSelector;
