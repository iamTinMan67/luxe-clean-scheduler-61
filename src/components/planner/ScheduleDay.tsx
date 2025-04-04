
import React from 'react';
import { format } from 'date-fns';
import { Booking } from '@/types/booking';
import { Clock } from 'lucide-react';

interface ScheduleDayProps {
  date: Date;
  bookings: Booking[];
  getBookingBackground: (booking: Booking) => string;
}

const ScheduleDay: React.FC<ScheduleDayProps> = ({ date, bookings, getBookingBackground }) => {
  return (
    <div className="col-span-1">
      <div className="text-center mb-3 py-2 border-b border-gray-800">
        <p className="text-gray-400 text-sm">{format(date, "EEEE")}</p>
        <h3 className="text-white font-bold">{format(date, "MMMM d, yyyy")}</h3>
      </div>

      {bookings.length > 0 ? (
        <div className="space-y-3">
          {bookings.map(booking => (
            <div 
              key={booking.id}
              className={`rounded-lg p-3 border-l-4 ${
                booking.status === "pending" ? "border-amber-500" : "border-gold"
              } ${getBookingBackground(booking)}`}
            >
              <div className="flex justify-between items-start mb-1">
                <h4 className="font-medium text-white">{booking.customer}</h4>
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  booking.status === "pending" 
                    ? "bg-amber-900/30 text-amber-400 border border-amber-700"
                    : "bg-green-900/30 text-green-400 border border-green-700"
                }`}>
                  {booking.status}
                </span>
              </div>
              
              <div className="text-gray-400 text-sm mb-1">
                {booking.vehicle} - {booking.packageType || "Standard Package"}
              </div>
              
              <div className="flex items-center text-gray-300 text-sm">
                <Clock className="w-3 h-3 mr-1 text-gold" />
                <span>{booking.startTime || booking.time || "09:00"} - {booking.endTime || "11:00"}</span>
              </div>
              
              {booking.staff && booking.staff.length > 0 && (
                <div className="mt-2 pt-2 border-t border-gray-700">
                  <p className="text-xs text-gray-400 mb-1">Assigned Staff:</p>
                  <div className="flex flex-wrap gap-1">
                    {booking.staff.map((staffMember, idx) => (
                      <span 
                        key={idx} 
                        className="text-xs bg-gray-700 px-2 py-0.5 rounded-full text-white"
                      >
                        {staffMember}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="h-32 border border-gray-800 border-dashed rounded-lg flex items-center justify-center">
          <p className="text-gray-500 text-sm">No bookings</p>
        </div>
      )}
    </div>
  );
};

export default ScheduleDay;
