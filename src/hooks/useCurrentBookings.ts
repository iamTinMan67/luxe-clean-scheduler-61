
import { useState, useEffect } from 'react';
import { Booking } from '@/types/booking';
import { useScheduledAppointments } from './useScheduledAppointments';
import { isSameDay } from '@/utils/dateParsingUtils';

export const useCurrentBookings = () => {
  const [currentBookings, setCurrentBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  // Get all appointments except cancelled ones
  const { appointments, loading: appointmentsLoading } = useScheduledAppointments();

  useEffect(() => {
    if (!appointmentsLoading) {
      console.log("=== Current Bookings Filter Debug ===");
      console.log("All appointments received:", appointments.length);
      console.log("All appointment statuses:", appointments.map(a => `${a.customer}:${a.status}`));

      const today = new Date();
      console.log("Today's date:", today.toDateString());

      // Filter by today's date and include pending bookings for today
      const filteredBookings = appointments.filter(booking => {
        const bookingDate = booking.date instanceof Date ? booking.date : new Date(booking.date);
        const isToday = isSameDay(bookingDate, today);
        // Include pending bookings that are scheduled for today, plus all confirmed/progressed statuses
        const hasValidStatus = ['pending', 'in-progress', 'confirmed', 'finished', 'inspecting', 'inspected'].includes(booking.status);
        
        console.log(`Booking ${booking.id} (${booking.customer}): date=${bookingDate.toDateString()}, status=${booking.status}, isToday=${isToday}, hasValidStatus=${hasValidStatus}`);
        
        return isToday && hasValidStatus;
      });

      console.log("=== Current Bookings Final Results ===");
      console.log("Filtered bookings (today + valid status including pending):", filteredBookings.length);
      console.log("Final bookings:", filteredBookings.map(b => ({
        id: b.id,
        customer: b.customer,
        status: b.status,
        date: b.date
      })));

      setCurrentBookings(filteredBookings);
      setLoading(false);
    }
  }, [appointments, appointmentsLoading]);

  return { currentBookings, loading };
};
