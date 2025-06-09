
import { useState } from "react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { useScheduledAppointments } from "@/hooks/useScheduledAppointments";
import TimeSlotGrid from "./TimeSlotGrid";
import BookingHelpMessage from "./BookingHelpMessage";
import PendingConflictMessage from "./PendingConflictMessage";

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
  // Get all scheduled appointments
  const { appointments, loading } = useScheduledAppointments();

  // Function to check if a day has bookings
  const dayHasBookings = (checkDate: Date) => {
    return appointments.some(booking => {
      // Only show indicators for confirmed bookings (not cancelled)
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
          
          <TimeSlotGrid
            date={date}
            time={time}
            appointments={appointments}
            onTimeChange={onTimeChange}
          />
          
          <BookingHelpMessage />
          
          {time && (
            <PendingConflictMessage 
              time={time}
              date={date}
              appointments={appointments}
            />
          )}
        </div>
      )}
    </>
  );
};

export default DateTimeSelector;
