
import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { Booking } from '@/types/booking';
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { CheckCircle2 } from "lucide-react";

interface DailyScheduleProps {
  date: Date;
}

const DailySchedule: React.FC<DailyScheduleProps> = ({ date }) => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  
  // Load bookings for the selected date
  useEffect(() => {
    // Get bookings from localStorage
    const confirmedBookingsStr = localStorage.getItem('confirmedBookings');
    const plannerBookingsStr = localStorage.getItem('plannerCalendarBookings');
    
    let dayBookings: Booking[] = [];
    
    if (confirmedBookingsStr) {
      try {
        const confirmedBookings = JSON.parse(confirmedBookingsStr);
        const filteredBookings = confirmedBookings.filter((booking: Booking) => {
          const bookingDate = new Date(booking.date);
          return bookingDate.getDate() === date.getDate() && 
                 bookingDate.getMonth() === date.getMonth() && 
                 bookingDate.getFullYear() === date.getFullYear();
        });
        dayBookings = [...dayBookings, ...filteredBookings];
      } catch (error) {
        console.error('Error parsing confirmed bookings', error);
      }
    }
    
    if (plannerBookingsStr) {
      try {
        const plannerBookings = JSON.parse(plannerBookingsStr);
        const filteredBookings = plannerBookings.filter((booking: Booking) => {
          const bookingDate = new Date(booking.date);
          return bookingDate.getDate() === date.getDate() && 
                 bookingDate.getMonth() === date.getMonth() && 
                 bookingDate.getFullYear() === date.getFullYear();
        }).filter((booking: Booking) => {
          // Avoid duplicates
          return !dayBookings.some(b => b.id === booking.id);
        });
        dayBookings = [...dayBookings, ...filteredBookings];
      } catch (error) {
        console.error('Error parsing planner bookings', error);
      }
    }
    
    // Sort bookings by time
    dayBookings.sort((a, b) => {
      const timeA = a.startTime || a.time || '09:00';
      const timeB = b.startTime || b.time || '09:00';
      return timeA.localeCompare(timeB);
    });
    
    setBookings(dayBookings);
  }, [date]);

  // Handler to mark a booking as completed
  const handleCompleteBooking = (booking: Booking) => {
    toast.success(`Booking completed for ${booking.customer}`, {
      description: "Service has been marked as completed."
    });
  };

  return (
    <div className="space-y-4">
      {bookings.length > 0 ? (
        bookings.map((booking) => {
          const startTime = booking.startTime || booking.time || '09:00';
          const endTime = booking.endTime || calculateEndTime(startTime);
          
          return (
            <div key={booking.id} className="bg-gray-800 rounded-md p-4 border border-gray-700">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-white">{booking.customer}</h3>
                <Badge className={getStatusBadgeClass(booking.status)}>
                  {booking.status}
                </Badge>
              </div>
              
              <div className="text-sm text-gray-300 mb-3">
                <p className="text-gold font-medium">{booking.packageType}</p>
                <p>{booking.vehicle}</p>
                <p className="mt-1">{startTime} - {endTime}</p>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="text-xs text-gray-400">
                  {booking.location && (
                    <span className="block">{booking.location}</span>
                  )}
                  {booking.staff && booking.staff.length > 0 && (
                    <span className="block text-blue-400">
                      {booking.staff.join(', ')}
                    </span>
                  )}
                </div>
                
                <button
                  onClick={() => handleCompleteBooking(booking)}
                  className="flex items-center gap-1 text-xs bg-green-800/50 hover:bg-green-700 text-green-300 py-1 px-2 rounded"
                >
                  <CheckCircle2 size={12} />
                  <span>Complete</span>
                </button>
              </div>
            </div>
          );
        })
      ) : (
        <div className="text-center py-6 text-gray-400">
          No bookings scheduled for this day
        </div>
      )}
    </div>
  );
};

// Helper function to calculate end time
const calculateEndTime = (startTime: string): string => {
  const [hours, minutes] = startTime.split(':').map(Number);
  let endHours = hours + 2; // Default 2 hour service
  
  if (endHours >= 24) {
    endHours = endHours - 24;
  }
  
  return `${endHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
};

// Helper function to get badge class based on status
const getStatusBadgeClass = (status: string): string => {
  switch (status) {
    case 'confirmed':
      return 'bg-green-900/60 text-green-300 border-green-700';
    case 'in-progress':
      return 'bg-blue-900/60 text-blue-300 border-blue-700';
    case 'completed':
      return 'bg-purple-900/60 text-purple-300 border-purple-700';
    case 'cancelled':
      return 'bg-red-900/60 text-red-300 border-red-700';
    default:
      return 'bg-gray-900/60 text-gray-300 border-gray-700';
  }
};

export default DailySchedule;
