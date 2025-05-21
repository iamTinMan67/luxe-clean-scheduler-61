
import React, { useState } from 'react';
import { format } from 'date-fns';
import { Booking } from '@/types/booking';
import { Clock, MapPin, Phone, FileText, ChevronDown, ChevronUp } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface ScheduleDayProps {
  date: Date;
  bookings: Booking[];
  getBookingBackground: (booking: Booking) => string;
}

const ScheduleDay: React.FC<ScheduleDayProps> = ({ date, bookings, getBookingBackground }) => {
  // Sort bookings by time
  const sortedBookings = [...bookings].sort((a, b) => {
    const timeA = a.startTime || a.time || '00:00';
    const timeB = b.startTime || b.time || '00:00';
    return timeA.localeCompare(timeB);
  });

  return (
    <div className="col-span-1">
      <div className="text-center mb-3 py-2 border-b border-gray-800">
        <p className="text-gray-400 text-sm">{format(date, "EEEE")}</p>
        <h3 className="text-white font-bold">{format(date, "MMMM d, yyyy")}</h3>
      </div>

      {sortedBookings.length > 0 ? (
        <div className="space-y-3">
          {sortedBookings.map(booking => (
            <div 
              key={booking.id}
              className={`rounded-lg p-3 border-l-4 ${getBookingBackground(booking)}`}
            >
              <div className="flex justify-between items-start mb-1">
                <h4 className="font-medium text-white">
                  {booking.customer}
                </h4>
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  booking.status === "pending" 
                    ? "bg-amber-900/30 text-amber-400 border border-amber-700"
                    : booking.status === "confirmed" 
                    ? "bg-green-900/30 text-green-400 border border-green-700"
                    : booking.status === "in-progress"
                    ? "bg-blue-900/30 text-blue-400 border border-blue-700"
                    : booking.status === "completed"
                    ? "bg-purple-900/30 text-purple-400 border border-purple-700"
                    : "bg-gray-900/30 text-gray-400 border border-gray-700"
                }`}>
                  {booking.status}
                </span>
              </div>
              
              <div className="text-gray-400 text-sm mb-1">
                {booking.vehicle || "No vehicle info"} - {booking.packageType || "Standard Package"}
              </div>
              
              <div className="flex items-center text-gray-300 text-sm">
                <Clock className="w-3 h-3 mr-1 text-gold" />
                <span>{booking.startTime || booking.time || "09:00"} - {booking.endTime || "11:00"}</span>
              </div>
              
              {/* Replace direct contact details with collapsible section */}
              <Collapsible className="mt-2 pt-2 border-t border-gray-700">
                <CollapsibleTrigger className="flex w-full items-center justify-between text-sm text-gray-400 hover:text-white">
                  <span>Contact Details</span>
                  <span className="ml-2">
                    {({ open }) => open ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </span>
                </CollapsibleTrigger>
                <CollapsibleContent className="pt-2 space-y-2">
                  {/* Location information if available */}
                  {booking.location && (
                    <div className="flex items-center text-gray-300 text-sm">
                      <MapPin className="w-3 h-3 mr-1 text-gold" />
                      <span>{booking.location}</span>
                    </div>
                  )}
                  
                  {/* Contact information if available */}
                  {booking.contact && (
                    <div className="flex items-center text-gray-300 text-sm">
                      <Phone className="w-3 h-3 mr-1 text-gold" />
                      <span>{booking.contact}</span>
                    </div>
                  )}
                  
                  {/* Add notes if available */}
                  {booking.notes && (
                    <div className="flex items-start text-gray-300 text-sm">
                      <FileText className="w-3 h-3 mr-1 mt-0.5 text-gold" />
                      <span className="flex-1">{booking.notes}</span>
                    </div>
                  )}
                </CollapsibleContent>
              </Collapsible>
              
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
