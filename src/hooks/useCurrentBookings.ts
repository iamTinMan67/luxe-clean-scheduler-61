
import { useState, useEffect } from 'react';
import { Booking } from '@/types/booking';
import { useScheduledAppointments } from './useScheduledAppointments';
import { isSameDay } from '@/utils/dateParsingUtils';

export const useCurrentBookings = () => {
  const [currentBookings, setCurrentBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Get all appointments except finished ones
  const { appointments, loading: appointmentsLoading } = useScheduledAppointments();

  useEffect(() => {
    if (!appointmentsLoading) {
      console.log("=== Current Bookings Filter Debug ===");
      console.log("All appointments received:", appointments.length);
      console.log("All appointment statuses:", appointments.map(a => `${a.customer}:${a.status}`));

      const today = new Date();
      console.log("Today's date:", today.toDateString());

      // Filter by today's date and specified statuses
      const filteredBookings = appointments.filter(booking => {
        const bookingDate = booking.date instanceof Date ? booking.date : new Date(booking.date);
        const isToday = isSameDay(bookingDate, today);
        const hasValidStatus = ['in-progress', 'confirmed', 'finished'].includes(booking.status);
        
        console.log(`Booking ${booking.id} (${booking.customer}): date=${bookingDate.toDateString()}, status=${booking.status}, isToday=${isToday}, hasValidStatus=${hasValidStatus}`);
        
        return isToday && hasValidStatus;
      });

      // Transform to match the RecentBookings component format
      const transformedBookings = filteredBookings.map(booking => ({
        id: booking.id,
        customer: booking.customer,
        vehicle: booking.vehicle || 'Unknown Vehicle',
        package: booking.packageType || 'Unknown Package',
        date: booking.date instanceof Date ? booking.date.toLocaleDateString() : booking.date,
        time: booking.time || 'Time TBD',
        status: booking.status
      }));

      console.log("=== Current Bookings Final Results ===");
      console.log("Filtered bookings (today + valid status):", transformedBookings.length);
      console.log("Final bookings:", transformedBookings.map(b => ({
        id: b.id,
        customer: b.customer,
        status: b.status,
        date: b.date
      })));

      setCurrentBookings(transformedBookings);
      setLoading(false);
    }
  }, [appointments, appointmentsLoading]);

  return { currentBookings, loading };
};
