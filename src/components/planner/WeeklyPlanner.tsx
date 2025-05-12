
import React from 'react';
import { motion } from "framer-motion";
import { format, isToday } from 'date-fns';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Booking } from '@/types/booking';
import { cn } from "@/lib/utils";
import { toast } from 'sonner';

interface WeeklyPlannerProps {
  date: Date;
  setDate: (date: Date | undefined) => void;
  schedule: Array<{date: Date, bookings: Booking[]}>;
  getBookingBackground: (booking: Booking) => string;
  checkTimeConflict: (date: Date, time: string) => boolean;
}

const WeeklyPlanner: React.FC<WeeklyPlannerProps> = ({
  date,
  setDate,
  schedule,
  getBookingBackground,
  checkTimeConflict
}) => {
  // Time slots to display in the weekly view
  const timeSlots = [
    "08:00", "09:00", "10:00", "11:00", "12:00",
    "13:00", "14:00", "15:00", "16:00", "17:00"
  ];

  // Handle booking time slot click
  const handleTimeSlotClick = (day: Date, time: string) => {
    // Check for conflicts
    const hasConflict = checkTimeConflict(day, time);
    
    if (hasConflict) {
      toast.error("Booking conflict detected", {
        description: `There's already a confirmed booking at ${time} on ${format(day, 'E, MMM d')}`,
      });
    } else {
      // Set the selected date and time for booking
      setDate(day);
      // Here you could navigate to booking form or open a modal
      toast.success("Time slot available", {
        description: `${format(day, 'E, MMM d')} at ${time} is available for booking`,
      });
    }
  };

  // Get bookings for a specific day and time slot
  const getBookingsForTimeSlot = (day: Date, timeSlot: string) => {
    const daySchedule = schedule.find(s => 
      s.date.getDate() === day.getDate() && 
      s.date.getMonth() === day.getMonth() &&
      s.date.getFullYear() === day.getFullYear()
    );
    
    if (!daySchedule) return [];
    
    return daySchedule.bookings.filter(booking => {
      const bookingTime = booking.startTime || booking.time;
      return bookingTime === timeSlot;
    });
  };

  // Check if a time slot is conflicting with confirmed bookings
  const isConflictingTimeSlot = (day: Date, timeSlot: string) => {
    return checkTimeConflict(day, timeSlot);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="mt-8"
    >
      <Card className="bg-gray-900 border-gray-800 p-6 overflow-x-auto">
        <h2 className="text-xl font-bold text-white mb-6">Weekly Schedule</h2>
        
        <div className="min-w-[800px]">
          {/* Days header */}
          <div className="grid grid-cols-8 gap-1 mb-2">
            <div className="sticky left-0 z-10 bg-gray-900 p-2"></div>
            {schedule.map((day) => (
              <div 
                key={day.date.toISOString()} 
                className={cn(
                  "text-center p-2 rounded-t-md font-medium",
                  isToday(day.date) ? "bg-gold text-black" : "bg-gray-800 text-white"
                )}
              >
                {format(day.date, 'E, MMM d')}
              </div>
            ))}
          </div>
          
          {/* Time slots */}
          {timeSlots.map((timeSlot) => (
            <div key={timeSlot} className="grid grid-cols-8 gap-1 mb-1">
              {/* Time column */}
              <div className="sticky left-0 z-10 bg-gray-900 p-2 text-right text-white font-medium">
                {timeSlot}
              </div>
              
              {/* Day columns */}
              {schedule.map((day) => {
                const bookings = getBookingsForTimeSlot(day.date, timeSlot);
                const hasConflict = isConflictingTimeSlot(day.date, timeSlot);
                
                return (
                  <div 
                    key={`${day.date.toISOString()}-${timeSlot}`}
                    onClick={() => handleTimeSlotClick(day.date, timeSlot)}
                    className={cn(
                      "border p-1 min-h-[50px] transition-colors cursor-pointer relative",
                      hasConflict 
                        ? "border-red-500 bg-red-900/20 hover:bg-red-900/30" 
                        : "border-gray-700 hover:bg-gray-800/50"
                    )}
                  >
                    {bookings.length > 0 ? (
                      bookings.map(booking => (
                        <div 
                          key={booking.id}
                          className={cn(
                            "text-xs p-1 rounded text-white overflow-hidden",
                            getBookingBackground(booking)
                          )}
                        >
                          {booking.customer} - {booking.packageType}
                        </div>
                      ))
                    ) : (
                      <div className="w-full h-full"></div>
                    )}
                    
                    {hasConflict && (
                      <div className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </Card>
    </motion.div>
  );
};

export default WeeklyPlanner;
