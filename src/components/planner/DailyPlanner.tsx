
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

  // Generate time slots in 15-minute increments from 08:00 to 17:00
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 8; hour <= 17; hour++) {
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

  // Group bookings by their time slot
  const getBookingsForTimeSlot = (timeSlot: string) => {
    if (!todaySchedule) return [];
    
    return todaySchedule.bookings.filter(booking => {
      const bookingTime = booking.startTime || booking.time || '';
      // Match bookings that start at this exact time or within this 15-minute window
      const [bookingHour, bookingMinute] = bookingTime.split(':').map(Number);
      const [slotHour, slotMinute] = timeSlot.split(':').map(Number);
      
      // Check if booking starts in this 15-minute window
      const bookingTotalMinutes = bookingHour * 60 + bookingMinute;
      const slotTotalMinutes = slotHour * 60 + slotMinute;
      const nextSlotTotalMinutes = slotTotalMinutes + 15;
      
      return bookingTotalMinutes >= slotTotalMinutes && bookingTotalMinutes < nextSlotTotalMinutes;
    });
  };

  return (
    <Card className="bg-gray-900 border-gray-800 mt-4">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-white">
          Daily Planner - {format(date, "EEEE, MMMM d, yyyy")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {timeSlots.length > 0 ? (
          <div className="grid grid-cols-1 gap-2">
            {timeSlots.map(timeSlot => {
              const slotBookings = getBookingsForTimeSlot(timeSlot);
              return (
                <div key={timeSlot} className="flex flex-col">
                  <div className="flex items-center mb-2">
                    <div className="text-white font-medium min-w-[60px]">{timeSlot}</div>
                    <div className="h-px flex-grow bg-gray-800 ml-2"></div>
                  </div>
                  
                  {slotBookings.length > 0 ? (
                    <div className="pl-[60px] space-y-2">
                      {slotBookings.map(booking => (
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
                  ) : (
                    <div className="pl-[60px] text-gray-600 text-sm">No bookings</div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-gray-600 italic text-center py-8">No bookings scheduled</div>
        )}
      </CardContent>
    </Card>
  );
};

export default DailyPlanner;
