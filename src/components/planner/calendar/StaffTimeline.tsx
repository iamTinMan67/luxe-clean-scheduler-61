
import React from 'react';
import { Booking } from '@/types/booking';
import { Card } from "@/components/ui/card";
import { staffMembers } from '@/data/staffData';
import { format } from 'date-fns';
import { getStatusInfo } from '@/utils/statusUtils';
import NotificationButtons from './NotificationButtons';
import EmptyCalendarView from './EmptyCalendarView';

interface StaffTimelineProps {
  date: Date;
  bookings: Booking[];
  onCompleteBooking: (booking: Booking) => void;
  onReschedule: (booking: Booking, date: Date) => void;
  onDeleteBooking: (booking: Booking) => void;
  onUpdateStatus: (booking: Booking, newStatus: "confirmed" | "in-progress" | "completed" | "finished" | "pending" | "cancelled") => void;
  onPackageChange: (booking: Booking, newPackage: string) => void;
}

const StaffTimeline: React.FC<StaffTimelineProps> = ({
  date,
  bookings,
  onCompleteBooking,
  onReschedule,
  onDeleteBooking,
  onUpdateStatus,
  onPackageChange
}) => {
  // Group bookings by staff
  const getStaffBookings = () => {
    // Create a map of staff to their bookings
    const staffBookingsMap = new Map<string, Booking[]>();
    
    // Initialize with all staff members
    staffMembers.forEach(staff => {
      staffBookingsMap.set(staff.name, []);
    });
    
    // Add all bookings that have staff assigned
    bookings.forEach(booking => {
      if (booking.staff && booking.staff.length > 0) {
        booking.staff.forEach(staffName => {
          if (staffBookingsMap.has(staffName)) {
            staffBookingsMap.get(staffName)?.push(booking);
          }
        });
      } else {
        // Handle bookings with no staff assigned - put them in "Unassigned"
        if (!staffBookingsMap.has("Unassigned")) {
          staffBookingsMap.set("Unassigned", []);
        }
        staffBookingsMap.get("Unassigned")?.push(booking);
      }
    });
    
    // Filter out staff with no bookings
    return Array.from(staffBookingsMap.entries())
      .filter(([_, bookings]) => bookings.length > 0)
      .sort(([a], [b]) => a.localeCompare(b)); // Sort by staff name
  };
  
  const staffBookings = getStaffBookings();
  
  // If no staff have bookings for this date
  if (staffBookings.length === 0) {
    return <EmptyCalendarView message={`No bookings scheduled for ${format(date, 'MMMM d, yyyy')}`} />;
  }
  
  // The hours to display in the timeline (8am to 6pm)
  const timeSlots = Array.from({ length: 11 }, (_, i) => i + 8);
  
  return (
    <div className="overflow-x-auto">
      <div className="min-w-[800px]">
        {/* Time header */}
        <div className="flex border-b border-gray-800 pb-2 mb-4">
          <div className="w-24 flex-shrink-0">
            <span className="text-gray-400 text-sm">Staff</span>
          </div>
          {timeSlots.map(hour => (
            <div key={hour} className="flex-1 text-center">
              <span className="text-gray-400 text-sm">{hour % 12 || 12}{hour < 12 ? 'am' : 'pm'}</span>
            </div>
          ))}
        </div>
        
        {/* Staff rows */}
        {staffBookings.map(([staffName, staffBookings]) => (
          <div key={staffName} className="flex mb-6">
            {/* Staff name */}
            <div className="w-24 flex-shrink-0 pr-2">
              <div className="font-medium text-gold truncate">{staffName}</div>
            </div>
            
            {/* Timeline */}
            <div className="flex-1 relative bg-gray-800/30 rounded-md h-16 border border-gray-800">
              {staffBookings.map(booking => {
                // Calculate position and width based on start/end time
                const startTime = booking.startTime || booking.time || '08:00';
                const endTime = booking.endTime || 
                  (startTime ? `${parseInt(startTime.split(':')[0]) + 2}:${startTime.split(':')[1]}` : '10:00');
                
                // Parse times to calculate position
                const [startHour, startMinute] = startTime.split(':').map(Number);
                const [endHour, endMinute] = endTime.split(':').map(Number);
                
                // Calculate time range in hours (e.g. 9.5 for 9:30)
                const timeStart = startHour + (startMinute / 60);
                const timeEnd = endHour + (endMinute / 60);
                
                // Calculate position as percentage (from 8am to 6pm = 10 hours)
                const startPos = Math.max(0, ((timeStart - 8) / 10) * 100);
                const width = Math.min(100 - startPos, ((timeEnd - timeStart) / 10) * 100);
                
                // Get status for styling
                const statusInfo = getStatusInfo(booking.status);
                
                return (
                  <div
                    key={booking.id}
                    className={`absolute rounded-sm py-1 px-2 text-xs z-10 ${statusInfo.color}`}
                    style={{
                      left: `${startPos}%`,
                      width: `${width}%`,
                      height: '80%',
                      top: '10%'
                    }}
                  >
                    <div className="flex flex-col h-full justify-between">
                      <div className="font-medium text-white truncate">{booking.customer}</div>
                      <div className="text-xs text-gray-300 truncate">{booking.vehicle}</div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-300">{startTime}-{endTime}</span>
                        <NotificationButtons
                          booking={booking}
                          onCompleteBooking={onCompleteBooking}
                          onReschedule={onReschedule}
                          onDeleteBooking={onDeleteBooking}
                          onUpdateStatus={onUpdateStatus}
                          onPackageChange={onPackageChange}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StaffTimeline;
