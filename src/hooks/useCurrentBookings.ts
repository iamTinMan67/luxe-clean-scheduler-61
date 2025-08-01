
import { useState, useEffect } from 'react';
import { Booking } from '@/types/booking';
import { useUnifiedBookings } from './useUnifiedBookings';
import { isSameDay } from '@/utils/dateParsingUtils';

export const useCurrentBookings = () => {
  const [currentBookings, setCurrentBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  // Get all bookings from unified hook (already deduplicated)
  const { allBookings, loading: bookingsLoading } = useUnifiedBookings();

  useEffect(() => {
    if (!bookingsLoading) {
      console.log("=== Current Bookings Filter Debug (Unified) ===");
      console.log("All unified bookings received:", allBookings.length);
      console.log("All booking statuses:", allBookings.map(a => `${a.customer}:${a.status}`));

      const today = new Date();
      console.log("Today's date:", today.toDateString());

      // Filter by today's date and include pending bookings for today
      const filteredBookings = allBookings.filter(booking => {
        const bookingDate = booking.date instanceof Date ? booking.date : new Date(booking.date);
        const isToday = isSameDay(bookingDate, today);
        // Include pending bookings that are scheduled for today, plus all confirmed/progressed statuses
        const hasValidStatus = ['pending', 'in-progress', 'confirmed', 'finished', 'inspecting', 'inspected'].includes(booking.status);
        
        console.log(`Unified Current Booking ${booking.id} (${booking.customer}): date=${bookingDate.toDateString()}, status=${booking.status}, isToday=${isToday}, hasValidStatus=${hasValidStatus}`);
        
        return isToday && hasValidStatus;
      });

      console.log("=== Current Bookings Final Results (Unified) ===");
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
  }, [allBookings, bookingsLoading]);

  return { currentBookings, loading };
};
