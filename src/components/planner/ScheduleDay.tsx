
import React, { useState } from 'react';
import { format } from 'date-fns';
import { Booking } from '@/types/booking';
import { Clock, MapPin, Phone, FileText, ChevronDown, ChevronUp, Mail, Building, Home } from 'lucide-react';
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

  // Track open state for collapsibles
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({});

  // Toggle open state for a specific booking
  const toggleOpen = (bookingId: string) => {
    setOpenItems(prev => ({
      ...prev,
      [bookingId]: !prev[bookingId]
    }));
  };

  // Helper functions for client type styling
  const getClientCategoryStyling = (type?: string) => {
    switch (type) {
      case "private":
        return "text-blue-400 border-blue-400";
      case "corporate":
        return "text-green-400 border-green-400";
      default:
        return "text-gray-400 border-gray-400";
    }
  };

  const getClientIcon = (type?: string) => {
    switch (type) {
      case "private":
        return <Home className="w-3 h-3 mr-1" />;
      case "corporate":
        return <Building className="w-3 h-3 mr-1" />;
      default:
        return null;
    }
  };

  const getClientLabel = (type?: string) => {
    switch (type) {
      case "private":
        return "Private";
      case "corporate":
        return "Commercial";
      default:
        return null;
    }
  };

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
                  {booking.customer} - {booking.id}
                </h4>
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  booking.status === "pending" 
                    ? "bg-amber-900/30 text-amber-400 border border-amber-700"
                    : booking.status === "confirmed" 
                    ? "bg-green-900/30 text-green-400 border border-green-700"
                    : booking.status === "in-progress"
                    ? "bg-blue-900/30 text-blue-400 border border-blue-700"
                    : booking.status === "finished"
                    ? "bg-purple-900/30 text-purple-400 border border-purple-700"
                    : "bg-gray-900/30 text-gray-400 border border-gray-700"
                }`}>
                  {booking.status}
                </span>
              </div>

              {/* Client Type and Job Type Display */}
              {(booking.clientType || booking.vehicleType) && (
                <div className="flex items-center justify-between mb-2">
                  {booking.clientType && (
                    <div className={`flex items-center px-2 py-1 rounded-full border text-xs ${getClientCategoryStyling(booking.clientType)}`}>
                      {getClientIcon(booking.clientType)}
                      <span>{getClientLabel(booking.clientType)}</span>
                    </div>
                  )}
                  {booking.vehicleType && (
                    <div className="text-gray-400 text-xs">
                      Job: {booking.vehicleType}
                    </div>
                  )}
                </div>
              )}
              
              <div className="text-gray-400 text-sm mb-1">
                {booking.vehicle || "No vehicle info"}
                {booking.packageType && booking.packageType !== "TBC" && ` - ${booking.packageType} Package`}
              </div>
              
              <div className="flex items-center text-gray-300 text-sm mb-2">
                <Clock className="w-3 h-3 mr-1 text-gold" />
                <span>{booking.startTime || booking.time || "09:00"} - {booking.endTime || "11:00"}</span>
              </div>

              {/* Job description display */}
              {booking.jobDetails && (
                <div className="text-blue-300 text-sm mb-1">
                  <strong>Job:</strong> {booking.jobDetails}
                </div>
              )}

              {/* Notes display */}
              {booking.notes && (
                <div className="text-yellow-300 text-sm mb-2">
                  <strong>Notes:</strong> {booking.notes}
                </div>
              )}
              
              {/* Replace direct contact details with collapsible section */}
              <Collapsible className="mt-2 pt-2 border-t border-gray-700">
                <CollapsibleTrigger 
                  className="flex w-full items-center justify-between text-sm text-gray-400 hover:text-white"
                  onClick={() => toggleOpen(booking.id)}
                >
                  <span>Contact Details</span>
                  <span className="ml-2">
                    {openItems[booking.id] ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
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
                  
                  {/* Email information if available */}
                  {booking.email && (
                    <div className="flex items-center text-gray-300 text-sm">
                      <Mail className="w-3 h-3 mr-1 text-gold" />
                      <span>{booking.email}</span>
                    </div>
                  )}
                  
                  {/* Contact information if available */}
                  {booking.contact && (
                    <div className="flex items-center text-gray-300 text-sm">
                      <Phone className="w-3 h-3 mr-1 text-gold" />
                      <span>{booking.contact}</span>
                    </div>
                  )}
                </CollapsibleContent>
              </Collapsible>
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
