
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Booking } from "@/types/booking";
import { format } from "date-fns";
import { parseTime } from "@/utils/dateUtils";

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

  // Generate time slots in 15-minute increments from 09:00 to 17:00
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 9; hour <= 17; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        if (hour === 17 && minute > 0) break; // Stop at 17:00
        const formattedHour = hour.toString().padStart(2, '0');
        const formattedMinute = minute.toString().padStart(2, '0');
        slots.push(`${formattedHour}:${formattedMinute}`);
      }
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  // Check if a booking spans this time slot
  const getBookingsForTimeSlot = (timeSlot: string) => {
    if (!todaySchedule) return [];
    
    return todaySchedule.bookings.filter(booking => {
      const bookingStartTime = booking.startTime || booking.time || '';
      const bookingEndTime = booking.endTime || '';
      
      if (!bookingStartTime) return false;
      
      // If no end time is specified, default to 2 hours after start time
      const actualEndTime = bookingEndTime || (() => {
        const [hours, minutes] = bookingStartTime.split(':').map(Number);
        const endHours = hours + 2;
        return `${endHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
      })();
      
      // Convert all to minutes for easier comparison
      const slotTime = parseTime(timeSlot);
      const startTime = parseTime(bookingStartTime);
      const endTime = parseTime(actualEndTime);
      
      const slotMinutes = slotTime.hours * 60 + slotTime.minutes;
      const startMinutes = startTime.hours * 60 + startTime.minutes;
      const endMinutes = endTime.hours * 60 + endTime.minutes;
      
      // Check if this slot falls within the booking time range
      return slotMinutes >= startMinutes && slotMinutes < endMinutes;
    });
  };

  // Check if a booking starts at this exact time slot (to display full booking details)
  const getBookingsStartingAtTimeSlot = (timeSlot: string) => {
    if (!todaySchedule) return [];
    
    return todaySchedule.bookings.filter(booking => {
      const bookingTime = booking.startTime || booking.time || '';
      return bookingTime === timeSlot;
    });
  };

  // Get the visual display class for time slots with bookings
  const getTimeSlotClass = (timeSlot: string, booking: Booking) => {
    const bookingStartTime = booking.startTime || booking.time || '';
    
    // If this is the first slot for this booking, add rounded-t-md
    if (bookingStartTime === timeSlot) {
      return `${getBookingBackground(booking)} opacity-80 h-full rounded-t-md border-t border-l border-r`;
    }
    
    // For all other slots in the booking's time range
    return `${getBookingBackground(booking)} opacity-70 h-full border-l border-r`;
  };

  return (
    <Card className="bg-gray-900 border-gray-800 mt-4">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-white">
          Daily Planner - {format(date, "EEEE, MMMM d, yyyy")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          {/* Time slot header row */}
          <div className="flex min-w-max mb-4 pb-2 border-b border-gray-800">
            {timeSlots.map(timeSlot => (
              <div key={timeSlot} className="flex-shrink-0 w-32 text-center">
                <div className="text-white font-medium">{timeSlot}</div>
              </div>
            ))}
          </div>

          {/* Booking rows */}
          <div className="flex min-w-max">
            {timeSlots.map(timeSlot => {
              const slotBookings = getBookingsForTimeSlot(timeSlot);
              const startingBookings = getBookingsStartingAtTimeSlot(timeSlot);
              
              return (
                <div key={timeSlot} className="flex-shrink-0 w-32 px-1 relative">
                  {slotBookings.length > 0 ? (
                    <div className="space-y-2 py-2">
                      {slotBookings.map(booking => {
                        const isStartSlot = (booking.startTime || booking.time) === timeSlot;
                        
                        // Only show full booking details at the start time
                        if (isStartSlot) {
                          return (
                            <div 
                              key={booking.id} 
                              className={`${getTimeSlotClass(timeSlot, booking)} p-2 rounded-t-md border-t`}
                            >
                              <div className="flex flex-col">
                                <div className="font-medium text-white truncate">
                                  {booking.customer} - {booking.id}
                                </div>
                                <p className="text-gray-400 text-xs truncate">
                                  {booking.packageType}
                                  {booking.travelMinutes && booking.travelMinutes > 0 && 
                                    ` (T: ${booking.travelMinutes}m)`
                                  }
                                </p>
                                <p className="text-xs text-gray-300">
                                  {(booking.startTime || booking.time)} - {booking.endTime || 'N/A'}
                                </p>
                                {booking.jobDetails && (
                                  <p className="text-xs text-blue-300 mt-1">
                                    Job: {booking.jobDetails}
                                  </p>
                                )}
                                {booking.notes && (
                                  <p className="text-xs text-yellow-300 mt-1">
                                    Notes: {booking.notes}
                                  </p>
                                )}
                                {booking.vehicleReg && (
                                  <Badge variant="outline" className="mt-1 text-xs bg-black/30 truncate">
                                    {booking.vehicleReg}
                                  </Badge>
                                )}
                                <Badge className={`mt-1 text-xs ${
                                  booking.status === "confirmed" ? "bg-green-900/60 text-green-300" : 
                                  booking.status === "pending" ? "bg-orange-900/60 text-orange-300 border border-orange-500" :
                                  "bg-amber-900/60 text-amber-300"
                                }`}>
                                  {booking.status}
                                </Badge>
                                {booking.staff && booking.staff.length > 0 && (
                                  <div className="mt-1 flex flex-wrap gap-1">
                                    {booking.staff.map(staff => (
                                      <Badge key={staff} variant="outline" className="text-xs bg-blue-900/30 text-blue-300 border-blue-800">
                                        {staff}
                                      </Badge>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        } else {
                          // For non-starting slots, show a slim continuation bar
                          return (
                            <div
                              key={`${booking.id}-${timeSlot}`}
                              className={`${getTimeSlotClass(timeSlot, booking)} p-1`}
                            >
                              <div className="h-1"></div>
                            </div>
                          );
                        }
                      })}
                    </div>
                  ) : (
                    <div className="h-8 text-gray-600 text-xs text-center border-r border-gray-800"></div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DailyPlanner;
