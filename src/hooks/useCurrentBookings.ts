
import { useState, useEffect } from 'react';
import { Booking } from '@/types/booking';
import { useScheduledAppointments } from './useScheduledAppointments';

export const useCurrentBookings = () => {
  const [currentBookings, setCurrentBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Get all appointments except completed/finished ones
  const { appointments, loading: appointmentsLoading } = useScheduledAppointments();

  useEffect(() => {
    if (!appointmentsLoading) {
      console.log("=== Current Bookings Filter Debug ===");
      console.log("All appointments received:", appointments.length);
      console.log("All appointment statuses:", appointments.map(a => `${a.customer}:${a.status}`));

      // Filter out completed and finished bookings
      const filteredBookings = appointments.filter(booking => {
        const isExcluded = booking.status === 'completed' || booking.status === 'finished';
        console.log(`Booking ${booking.id} (${booking.customer}): status=${booking.status}, excluded=${isExcluded}`);
        return !isExcluded;
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
      console.log("Filtered bookings (excluding completed/finished):", transformedBookings.length);
      console.log("Final bookings:", transformedBookings.map(b => ({
        id: b.id,
        customer: b.customer,
        status: b.status
      })));

      setCurrentBookings(transformedBookings);
      setLoading(false);
    }
  }, [appointments, appointmentsLoading]);

  return { currentBookings, loading };
};
