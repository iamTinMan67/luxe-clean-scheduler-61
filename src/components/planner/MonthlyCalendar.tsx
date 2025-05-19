
import React from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isSameMonth } from 'date-fns';
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Booking } from '@/types/booking';
import { cn } from '@/lib/utils';

interface MonthlyCalendarProps {
  date: Date;
  setDate: (date: Date) => void;
  bookings: Booking[];
  hasBookingsOnDate: (date: Date) => boolean;
  navigatePrevious: () => void;
  navigateNext: () => void;
}

const MonthlyCalendar: React.FC<MonthlyCalendarProps> = ({
  date,
  setDate,
  bookings,
  hasBookingsOnDate,
  navigatePrevious,
  navigateNext
}) => {
  // Generate days for the current month view
  const getDaysInMonth = () => {
    const start = startOfMonth(date);
    const end = endOfMonth(date);
    return eachDayOfInterval({ start, end });
  };

  const days = getDaysInMonth();
  const today = new Date();
  
  const daysOfWeek = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
  
  // Calculate which day of the week the month starts on
  const firstDayOfMonth = startOfMonth(date);
  const startingDayIndex = firstDayOfMonth.getDay(); // 0 = Sunday, 1 = Monday, etc.
  
  // Create an array for all cells we need to render in the calendar
  const calendarCells = [];
  
  // Add empty cells for days of the week before the first day of the month
  for (let i = 0; i < startingDayIndex; i++) {
    calendarCells.push(null);
  }
  
  // Add the actual days of the month
  calendarCells.push(...days);

  return (
    <div className="select-none">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-white">
          {format(date, 'MMMM yyyy')}
        </h3>
        <div className="flex">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={navigatePrevious}
            className="text-white"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={navigateNext}
            className="text-white"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-7 gap-1">
        {/* Days of week header */}
        {daysOfWeek.map((day) => (
          <div 
            key={day} 
            className="text-center text-xs font-medium text-gray-400 py-1"
          >
            {day}
          </div>
        ))}
        
        {/* Calendar days */}
        {calendarCells.map((day, i) => {
          if (!day) {
            return <div key={`empty-${i}`} className="h-8" />;
          }
          
          const isToday = isSameDay(day, today);
          const isSelected = isSameDay(day, date);
          const hasBookings = hasBookingsOnDate(day);
          
          return (
            <Button
              key={day.toString()}
              variant="ghost"
              className={cn(
                "h-8 w-full p-0 hover:bg-gray-800",
                isToday && "border border-blue-500",
                isSelected && "bg-gold text-black hover:bg-amber-500",
                hasBookings && !isSelected && "text-white font-bold"
              )}
              onClick={() => setDate(day)}
            >
              {format(day, 'd')}
              {hasBookings && !isSelected && (
                <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-gold rounded-full"></span>
              )}
            </Button>
          );
        })}
      </div>
    </div>
  );
};

export default MonthlyCalendar;
