
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Booking } from "@/types/booking";
import { format } from "date-fns";

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

  return (
    <Card className="bg-gray-900 border-gray-800 mt-8">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-white">
          Daily Planner - {format(date, "EEEE, MMMM d, yyyy")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-1">
          {timeSlots.map(timeSlot => {
            const bookingsInSlot = getBookingsForTimeSlot(timeSlot);
            const hasBookings = bookingsInSlot.length > 0;
            
            return (
              <div 
                key={timeSlot} 
                className={`flex ${isHourMark(timeSlot) ? 'border-t border-gray-700' : ''}`}
              >
                <div className={`text-white font-medium min-w-[70px] py-2 ${isHourMark(timeSlot) ? 'text-base' : 'text-xs text-gray-400'}`}>
                  {timeSlot}
                </div>
                
                {hasBookings ? (
                  <div className="flex-grow grid grid-cols-1 gap-2 pl-2 py-1">
                    {bookingsInSlot.map(booking => (
                      <div 
                        key={`${timeSlot}-${booking.id}`} 
                        className={`${getBookingBackground(booking)} p-2 rounded-md`}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="text-white font-medium text-sm">{booking.customer}</h4>
                            <p className="text-gray-400 text-xs">
                              {booking.packageType}
                              {booking.travelMinutes && booking.travelMinutes > 0 && 
                                ` (Travel: ${booking.travelMinutes} mins)`
                              }
                            </p>
                            <p className="text-[10px] text-gray-500">
                              {(booking.startTime || booking.time)} - {booking.endTime || 'N/A'}
                            </p>
                          </div>
                          <Badge className={booking.status === "confirmed" ? "bg-green-900/60 text-green-300 text-xs" : "bg-amber-900/60 text-amber-300 text-xs"}>
                            {booking.status}
                          </Badge>
                        </div>
                        {booking.staff && booking.staff.length > 0 && (
                          <div className="mt-1 flex flex-wrap gap-1">
                            {booking.staff.map(staff => (
                              <Badge key={staff} variant="outline" className="bg-blue-900/30 text-blue-300 border-blue-800 text-[10px]">
                                {staff}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex-grow border-l border-gray-800 ml-2"></div>
                )}
              </div>
            );
          })}
          
          {!todaySchedule || todaySchedule.bookings.length === 0 ? (
            <div className="text-gray-600 italic text-center py-8">No bookings scheduled</div>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
};

export default DailyPlanner;
