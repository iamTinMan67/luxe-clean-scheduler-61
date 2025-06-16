
import { Booking } from '@/types/booking';

export const loadBookingsFromLocalStorage = (statusFilter?: string[]): Booking[] => {
  console.log("=== Loading from localStorage fallback ===");
  console.log("Status filter:", statusFilter);
  
  let allBookings: Booking[] = [];
  
  try {
    // Load from multiple localStorage sources
    const sources = [
      { key: 'confirmedBookings', name: 'Confirmed Bookings' },
      { key: 'plannerCalendarBookings', name: 'Planner Calendar Bookings' },
      { key: 'pendingBookings', name: 'Pending Bookings' }
    ];
    
    const existingIds = new Set<string>();
    
    sources.forEach(source => {
      const stored = localStorage.getItem(source.key);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          console.log(`${source.name}: found ${parsed.length} bookings`);
          
          parsed.forEach((booking: any) => {
            if (!existingIds.has(booking.id)) {
              const normalizedBooking: Booking = {
                ...booking,
                date: booking.date instanceof Date ? booking.date : new Date(booking.date),
                status: booking.status || 'pending',
                // Ensure required fields have fallback values
                customer: booking.customer || booking.yourName || 'Unknown Customer',
                vehicle: booking.vehicle || booking.jobDetails || 'Unknown Vehicle',
                packageType: booking.packageType || 'standard',
                time: booking.time || booking.startTime || '00:00',
                location: booking.location || booking.postcode || 'Unknown Location',
                contact: booking.contact || booking.phone || ''
              };
              
              // Apply status filter if provided
              if (!statusFilter || statusFilter.includes(normalizedBooking.status)) {
                allBookings.push(normalizedBooking);
                existingIds.add(booking.id);
                console.log(`Added booking: ${normalizedBooking.customer} (${normalizedBooking.status}) - Time: ${normalizedBooking.time}, Package: ${normalizedBooking.packageType}`);
              }
            }
          });
        } catch (parseError) {
          console.error(`Error parsing ${source.name}:`, parseError);
        }
      } else {
        console.log(`${source.name}: no data found`);
      }
    });
    
  } catch (error) {
    console.error('Error loading from localStorage:', error);
  }
  
  console.log(`=== localStorage fallback complete: ${allBookings.length} bookings loaded ===`);
  console.log('Loaded bookings:', allBookings.map(b => ({
    id: b.id,
    customer: b.customer,
    status: b.status,
    date: b.date,
    time: b.time,
    packageType: b.packageType
  })));
  
  return allBookings;
};
