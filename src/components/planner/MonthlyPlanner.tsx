
import React from 'react';
import { motion } from "framer-motion";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday } from 'date-fns';
import { Card } from "@/components/ui/card";
import { Booking } from '@/types/booking';
import { cn } from "@/lib/utils";

interface MonthlyPlannerProps {
  date: Date;
  setDate: (date: Date | undefined) => void;
  schedule: Array<{date: Date, bookings: Booking[]}>;
  getBookingBackground: (booking: Booking) => string;
  hasBookingsOnDate: (date: Date) => boolean;
}

const MonthlyPlanner: React.FC<MonthlyPlannerProps> = ({
  date,
  setDate,
  schedule,
  getBookingBackground,
  hasBookingsOnDate
}) => {
  // Generate all days for the current month view
  const monthStart = startOfMonth(date);
  const monthEnd = endOfMonth(date);
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });
  
  // Calculate how many empty cells we need at the start for proper alignment
  const startDayOfWeek = monthStart.getDay(); // 0 = Sunday, 1 = Monday, etc.
  const emptyCellsAtStart = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1; // For Monday as first day
  
  // Create empty cells array for the start
  const emptyCellsBefore = Array.from({ length: emptyCellsAtStart });
  
  // Get bookings for a specific day
  const getBookingsForDay = (day: Date) => {
    const daySchedule = schedule.find(s => 
      s.date.getDate() === day.getDate() && 
      s.date.getMonth() === day.getMonth() &&
      s.date.getFullYear() === day.getFullYear()
    );
    
    if (!daySchedule) return [];
    return daySchedule.bookings;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="mt-8"
    >
      <Card className="bg-gray-900 border-gray-800 p-6">
        <h2 className="text-xl font-bold text-white mb-6">{format(date, 'MMMM yyyy')}</h2>
        
        <div className="grid grid-cols-7 gap-1 mb-2">
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(day => (
            <div key={day} className="text-center p-2 bg-gray-800 text-white font-medium">
              {day}
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 gap-1">
          {/* Empty cells before the first day */}
          {emptyCellsBefore.map((_, index) => (
            <div key={`empty-start-${index}`} className="border border-gray-800 min-h-[100px]"></div>
          ))}
          
          {/* Actual days of the month */}
          {monthDays.map((day) => {
            const dayBookings = getBookingsForDay(day);
            const hasDayBookings = hasBookingsOnDate(day);
            
            return (
              <div
                key={day.toISOString()}
                onClick={() => setDate(day)}
                className={cn(
                  "border p-1 min-h-[100px] transition-colors cursor-pointer",
                  isToday(day) ? "border-gold" : "border-gray-700",
                  isSameMonth(day, date) ? "hover:bg-gray-800/50" : "opacity-50"
                )}
              >
                <div className="flex justify-between items-center mb-1">
                  <span 
                    className={cn(
                      "text-sm font-medium", 
                      isToday(day) ? "bg-gold text-black px-2 py-1 rounded-full" : "text-white",
                      hasDayBookings ? "font-bold" : ""
                    )}
                  >
                    {format(day, 'd')}
                  </span>
                  
                  {hasDayBookings && (
                    <span className="h-2 w-2 bg-green-500 rounded-full"></span>
                  )}
                </div>
                
                <div className="space-y-1">
                  {dayBookings.slice(0, 2).map((booking) => (
                    <div 
                      key={booking.id}
                      className={cn(
                        "text-xs p-1 rounded text-white truncate",
                        getBookingBackground(booking)
                      )}
                    >
                      {booking.time && booking.time.substring(0, 5)} {booking.customer.substring(0, 10)}...
                    </div>
                  ))}
                  
                  {dayBookings.length > 2 && (
                    <div className="text-xs text-gray-400">
                      +{dayBookings.length - 2} more
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </motion.div>
  );
};

export default MonthlyPlanner;
