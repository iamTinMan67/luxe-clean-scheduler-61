
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Booking } from "@/types/booking";
import { format } from "date-fns";
import { addMinutesToTime } from '@/utils/dateUtils';

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

  // Generate 30-minute time slots from 8:00 to 18:00
  const generateTimeSlots = () => {
    const slots = [];
    let hour = 8;
    let minute = 0;
    
    while (hour < 19) {
      const formattedHour = hour.toString().padStart(2, '0');
      const formattedMinute = minute.toString().padStart(2, '0');
      slots.push(`${formattedHour}:${formattedMinute}`);
      
      minute += 30;
      if (minute >= 60) {
        minute = 0;
        hour += 1;
      }
    }
    
    return slots;
  };
  
  const timeSlots = generateTimeSlots();

  // Get bookings for a specific time slot
  const getBookingsForTimeSlot = (timeSlot: string) => {
    if (!todaySchedule) return [];
    
    return todaySchedule.bookings.filter(booking => {
      const bookingStartTime = booking.startTime || booking.time;
      const bookingEndTime = booking.endTime;
      
      if (!bookingStartTime) return false;
      
      // Include travel time before booking
      const travelMinutesBefore = booking.travelMinutes || 0;
      let actualStartTime = bookingStartTime;
      
      // Adjust start time for travel
      if (travelMinutesBefore > 0) {
        actualStartTime = addMinutesToTime(bookingStartTime, -travelMinutesBefore);
      }
      
      // Calculate end time including travel after
      let actualEndTime;
      if (bookingEndTime) {
        const travelMinutesAfter = booking.travelMinutes || 0;
        actualEndTime = travelMinutesAfter > 0 
          ? addMinutesToTime(bookingEndTime, travelMinutesAfter) 
          : bookingEndTime;
      } else {
        // Default 2-hour duration + travel time
        const travelMinutesAfter = booking.travelMinutes || 0;
        actualEndTime = addMinutesToTime(addMinutesToTime(bookingStartTime, 120), travelMinutesAfter);
      }
      
      // Parse all times to compare numerically
      const slotHour = parseInt(timeSlot.split(':')[0]);
      const slotMinute = parseInt(timeSlot.split(':')[1]);
      const startHour = parseInt(actualStartTime.split(':')[0]);
      const startMinute = parseInt(actualStartTime.split(':')[1]);
      const endHour = parseInt(actualEndTime.split(':')[0]);
      const endMinute = parseInt(actualEndTime.split(':')[1]);
      
      // Convert to minutes for easier comparison
      const slotTimeInMinutes = slotHour * 60 + slotMinute;
      const startTimeInMinutes = startHour * 60 + startMinute;
      const endTimeInMinutes = endHour * 60 + endMinute;
      
      // Check if this slot falls within the booking timeframe
      return slotTimeInMinutes >= startTimeInMinutes && slotTimeInMinutes < endTimeInMinutes;
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
        <div className="grid grid-cols-1 gap-4">
          {timeSlots.map(timeSlot => (
            <div key={timeSlot} className="flex flex-col">
              <div className="flex items-center mb-2">
                <div className="text-white font-medium min-w-[60px]">{timeSlot}</div>
                <div className="h-px flex-grow bg-gray-800 ml-2"></div>
              </div>
              
              <div className="pl-[60px] space-y-2">
                {getBookingsForTimeSlot(timeSlot).length > 0 ? (
                  getBookingsForTimeSlot(timeSlot).map(booking => (
                    <div 
                      key={booking.id} 
                      className={`${getBookingBackground(booking)} p-3 rounded-md border`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="text-white font-medium">{booking.customer}</h4>
                          <p className="text-gray-400 text-sm">
                            {booking.packageType}
                            {booking.travelMinutes && booking.travelMinutes > 0 && 
                              ` (Travel: ${booking.travelMinutes} mins)`
                            }
                          </p>
                          <p className="text-xs text-gray-500">
                            {(booking.startTime || booking.time)} - {booking.endTime || 'N/A'}
                          </p>
                          {booking.vehicleReg && (
                            <Badge variant="outline" className="mt-1 bg-black/30">
                              {booking.vehicleReg}
                            </Badge>
                          )}
                        </div>
                        <Badge className={booking.status === "confirmed" ? "bg-green-900/60 text-green-300" : "bg-amber-900/60 text-amber-300"}>
                          {booking.status}
                        </Badge>
                      </div>
                      {booking.staff && booking.staff.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {booking.staff.map(staff => (
                            <Badge key={staff} variant="outline" className="bg-blue-900/30 text-blue-300 border-blue-800">
                              {staff}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-gray-600 italic">No bookings scheduled</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default DailyPlanner;
