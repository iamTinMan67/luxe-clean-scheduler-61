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

  const timeSlots = [
    "09:00", "10:00", "11:00", "12:00", "13:00", 
    "14:00", "15:00", "16:00", "17:00", "18:00"
  ];

  // Get bookings for a specific time slot
  const getBookingsForTimeSlot = (timeSlot: string) => {
    if (!todaySchedule) return [];
    
    return todaySchedule.bookings.filter(booking => {
      const bookingStartTime = booking.time || booking.startTime;
      const bookingEndTime = booking.endTime;
      
      // Check if booking falls within this time slot
      if (!bookingStartTime) return false;
      
      const bookingHour = parseInt(bookingStartTime.split(':')[0]);
      const timeSlotHour = parseInt(timeSlot.split(':')[0]);
      
      // If booking has an end time, check if it spans this slot
      if (bookingEndTime) {
        const endHour = parseInt(bookingEndTime.split(':')[0]);
        return bookingHour <= timeSlotHour && endHour > timeSlotHour;
      }
      
      // Otherwise just check if it starts in this slot
      return bookingHour === timeSlotHour;
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
                          <p className="text-gray-400 text-sm">{booking.packageName}</p>
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
