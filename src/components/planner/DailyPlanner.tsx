
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

  // Group bookings by their start time
  const bookingsByTime = todaySchedule?.bookings.reduce((acc, booking) => {
    const timeSlot = booking.startTime || booking.time || '09:00';
    if (!acc[timeSlot]) {
      acc[timeSlot] = [];
    }
    acc[timeSlot].push(booking);
    return acc;
  }, {} as Record<string, Booking[]>) || {};

  // Sort time slots
  const sortedTimeSlots = Object.keys(bookingsByTime).sort();

  return (
    <Card className="bg-gray-900 border-gray-800 mt-8">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-white">
          Daily Planner - {format(date, "EEEE, MMMM d, yyyy")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {sortedTimeSlots.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {sortedTimeSlots.map(timeSlot => (
              <div key={timeSlot} className="flex flex-col">
                <div className="flex items-center mb-2">
                  <div className="text-white font-medium min-w-[60px]">{timeSlot}</div>
                  <div className="h-px flex-grow bg-gray-800 ml-2"></div>
                </div>
                
                <div className="pl-[60px] space-y-2">
                  {bookingsByTime[timeSlot].map(booking => (
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
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-gray-600 italic text-center py-8">No bookings scheduled</div>
        )}
      </CardContent>
    </Card>
  );
};

export default DailyPlanner;
