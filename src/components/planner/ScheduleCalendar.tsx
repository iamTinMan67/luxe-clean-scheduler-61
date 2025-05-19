
import React from 'react';
import { motion } from "framer-motion";
import { Calendar } from "@/components/ui/calendar";
import { Booking } from '@/types/booking';
import { format } from 'date-fns';

interface ScheduleCalendarProps {
  date: Date;
  setDate: (date: Date | undefined) => void;
  schedule: Array<{date: Date, bookings: Booking[]}>;
  getBookingBackground: (booking: Booking) => string;
  hasBookingsOnDate?: (date: Date) => boolean;
}

const ScheduleCalendar: React.FC<ScheduleCalendarProps> = ({
  date,
  setDate,
  schedule,
  getBookingBackground,
  hasBookingsOnDate
}) => {
  // Count bookings by date
  const getBookingsCount = (checkDate: Date): number => {
    const daySchedule = schedule.find(day => 
      day.date.getDate() === checkDate.getDate() && 
      day.date.getMonth() === checkDate.getMonth() && 
      day.date.getFullYear() === checkDate.getFullYear()
    );
    
    return daySchedule?.bookings.length || 0;
  };
  
  return (
    <div>
      <div className="text-sm text-gray-500 mb-2">
        {format(date, 'EEEE, MMMM d, yyyy')}
      </div>
        
      <Calendar
        mode="single"
        selected={date}
        onSelect={(newDate) => newDate && setDate(newDate)}
        className="bg-gray-900 border border-gray-800 rounded-md"
        classNames={{
          day_selected: "bg-gold text-black hover:bg-gold hover:text-black",
          day_today: "bg-gray-800 text-white",
          day: "hover:bg-gray-800 focus:bg-gray-800",
        }}
        modifiers={{
          highlighted: hasBookingsOnDate,
          noBookings: (day) => hasBookingsOnDate ? !hasBookingsOnDate(day) : false
        }}
        modifiersClassNames={{
          highlighted: "border-gold text-gold",
          noBookings: "text-gray-600"
        }}
      />
      
      {/* Show a legend for the calendar */}
      <div className="flex justify-center mt-4 gap-4 text-sm">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-gold rounded-full mr-2"></div>
          <span className="text-gray-400">Selected</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 border border-gold rounded-full mr-2"></div>
          <span className="text-gray-400">Has bookings</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-gray-800 rounded-full mr-2"></div>
          <span className="text-gray-400">Today</span>
        </div>
      </div>
    </div>
  );
};

export default ScheduleCalendar;
