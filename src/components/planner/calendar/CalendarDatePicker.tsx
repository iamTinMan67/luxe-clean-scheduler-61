
import React from 'react';
import { Calendar } from "@/components/ui/calendar";

interface CalendarDatePickerProps {
  date: Date | undefined;
  onDateChange: (date: Date | undefined) => void;
  refreshKey: number;
}

const CalendarDatePicker: React.FC<CalendarDatePickerProps> = ({ date, onDateChange, refreshKey }) => {
  // Function to check if a date has bookings - only use confirmed bookings
  const hasBookingsOnDate = (checkDate: Date) => {
    const confirmedBookings = JSON.parse(localStorage.getItem('confirmedBookings') || '[]');
    const plannerBookings = JSON.parse(localStorage.getItem('plannerCalendarBookings') || '[]');
    const allBookings = [...confirmedBookings, ...plannerBookings];
      
    return allBookings.some((booking: any) => {
      const bookingDate = booking.date instanceof Date ? booking.date : new Date(booking.date);
      return bookingDate.getDate() === checkDate.getDate() &&
             bookingDate.getMonth() === checkDate.getMonth() &&
             bookingDate.getFullYear() === checkDate.getFullYear();
    });
  };
  
  return (
    <div className="w-full md:w-auto" key={refreshKey}>
      <Calendar
        mode="single"
        selected={date}
        onSelect={onDateChange}
        className="bg-black/30 border border-gold/30 rounded-md"
        modifiers={{
          highlighted: hasBookingsOnDate
        }}
        modifiersClassNames={{
          highlighted: "font-bold text-gold bg-gold/20 rounded-md",
          noBookings: "text-white font-normal"
        }}
      />
    </div>
  );
};

export default CalendarDatePicker;
