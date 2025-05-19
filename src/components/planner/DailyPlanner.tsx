
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Booking } from "@/types/booking";
import { format } from "date-fns";
import { toast } from "sonner";

interface DailyPlannerProps {
  date: Date;
  setDate: (date: Date) => void;
  schedule: Array<{date: Date, bookings: Booking[]}>;
  getBookingBackground: (booking: Booking) => string;
}

const DailyPlanner: React.FC<DailyPlannerProps> = ({
  date,
  setDate,
  schedule,
  getBookingBackground
}) => {
  // Find today's schedule
  const todaySchedule = schedule.find(day => 
    day.date.getDate() === date.getDate() && 
    day.date.getMonth() === date.getMonth() && 
    day.date.getFullYear() === date.getFullYear()
  );

  // Generate time slots for every 15 minutes between 8:00 and 17:00
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

  // Function to check if a booking starts at or covers a specific time slot
  const getBookingsForTimeSlot = (timeSlot: string) => {
    if (!todaySchedule?.bookings || todaySchedule.bookings.length === 0) return [];
    
    return todaySchedule.bookings.filter(booking => {
      const bookingStartTime = booking.startTime || booking.time || '09:00';
      const bookingEndTime = booking.endTime || 
        (booking.startTime ? 
          // If we have a startTime but no endTime, assume 2 hours later
          `${parseInt(booking.startTime.split(':')[0]) + 2}:${booking.startTime.split(':')[1]}` : 
          // If we only have time, assume it's 2 hours from that time
          `${parseInt(bookingStartTime.split(':')[0]) + 2}:${bookingStartTime.split(':')[1]}`
        );

      // Convert times to minutes for easier comparison
      const timeSlotMinutes = convertTimeToMinutes(timeSlot);
      const startTimeMinutes = convertTimeToMinutes(bookingStartTime);
      const endTimeMinutes = convertTimeToMinutes(bookingEndTime);

      // Check if time slot falls within the booking's time range
      return (
        timeSlotMinutes >= startTimeMinutes && 
        timeSlotMinutes < endTimeMinutes
      ) || timeSlotMinutes === startTimeMinutes;
    });
  };

  // Helper to convert time string (HH:MM) to minutes
  const convertTimeToMinutes = (time: string): number => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  };

  // Function to check if a time slot is an hour mark (XX:00)
  const isHourMark = (timeSlot: string): boolean => {
    return timeSlot.endsWith(':00');
  };

  // Function to mark a booking as complete (for demo/testing purposes)
  const handleCompleteBooking = (booking: Booking) => {
    toast.success("Booking Completed", {
      description: `${booking.customer}'s booking has been marked as completed.`,
    });
  };

  return (
    <Card className="bg-gray-900 border-gray-800 mt-8">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-white">
          Daily Planner - {format(date, "EEEE, MMMM d, yyyy")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <div className="min-w-[1200px]">
            {/* Time slot header */}
            <div className="grid grid-cols-37 gap-1 mb-2 border-b border-gray-700 pb-2">
              {/* Empty cell for hour labels */}
              <div className="col-span-1"></div>
              
              {/* Time slot labels */}
              {timeSlots.map(timeSlot => (
                <div 
                  key={timeSlot} 
                  className={`text-center ${isHourMark(timeSlot) ? 'text-white font-medium' : 'text-gray-400 text-xs'}`}
                >
                  {timeSlot}
                </div>
              ))}
            </div>
            
            {/* If we have bookings, display them in rows */}
            {todaySchedule && todaySchedule.bookings && todaySchedule.bookings.length > 0 ? (
              <div className="space-y-4">
                {todaySchedule.bookings.map(booking => {
                  const bookingStartTime = booking.startTime || booking.time || '09:00';
                  const bookingEndTime = booking.endTime || 
                    (booking.startTime ? 
                      `${parseInt(booking.startTime.split(':')[0]) + 2}:${booking.startTime.split(':')[1]}` : 
                      `${parseInt(bookingStartTime.split(':')[0]) + 2}:${bookingStartTime.split(':')[1]}`
                    );
                  
                  // Calculate start and end slot indexes
                  const startSlotIndex = timeSlots.findIndex(slot => slot === bookingStartTime);
                  const endSlotIndex = timeSlots.findIndex(slot => slot === bookingEndTime);
                  
                  // Calculate span (how many slots this booking takes up)
                  const slotSpan = endSlotIndex > startSlotIndex ? endSlotIndex - startSlotIndex : 
                                   timeSlots.length - startSlotIndex;
                  
                  return (
                    <div key={booking.id} className="grid grid-cols-37 gap-1">
                      {/* Booking info in first column */}
                      <div className="col-span-1 pr-2 flex items-center">
                        <div className="text-white text-sm">
                          {booking.customer}
                        </div>
                      </div>
                      
                      {/* Render empty cells before the booking starts */}
                      {startSlotIndex > 0 && (
                        <div className={`col-span-${startSlotIndex}`}></div>
                      )}
                      
                      {/* Render the booking */}
                      <div 
                        className={`${getBookingBackground(booking)} p-2 rounded-md flex items-center justify-between cursor-pointer col-span-${slotSpan}`}
                        onClick={() => handleCompleteBooking(booking)}
                        style={{ gridColumn: `span ${slotSpan}` }}
                      >
                        <div>
                          <h4 className="text-white font-medium text-sm">{booking.packageType}</h4>
                          <p className="text-[10px] text-gray-300">
                            {bookingStartTime} - {bookingEndTime}
                          </p>
                        </div>
                        <div className="flex flex-col items-end">
                          <Badge className={booking.status === "confirmed" ? "bg-green-900/60 text-green-300 text-xs" : "bg-amber-900/60 text-amber-300 text-xs"}>
                            {booking.status}
                          </Badge>
                          {booking.staff && booking.staff.length > 0 && (
                            <div className="mt-1 text-[10px] text-blue-300">
                              {booking.staff.join(', ')}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* Fill remaining slots if needed */}
                      {startSlotIndex + slotSpan < timeSlots.length && (
                        <div className={`col-span-${timeSlots.length - (startSlotIndex + slotSpan)}`}></div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-gray-600 italic text-center py-8">No bookings scheduled</div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DailyPlanner;
