
import { Booking } from '@/types/booking';

// Function to detect mock/test bookings
const isMockBooking = (booking: any): boolean => {
  const mockIndicators = [
    'test-booking',
    'mock-booking',
    'example-booking',
    'demo-booking',
    'Test Customer',
    'Mock Customer',
    'Example Customer',
    'Demo Customer'
  ];
  
  // Check if ID contains mock indicators
  if (booking.id && mockIndicators.some(indicator => 
    booking.id.toLowerCase().includes(indicator.toLowerCase())
  )) {
    return true;
  }
  
  // Check if customer name contains mock indicators
  if (booking.customer && mockIndicators.some(indicator => 
    booking.customer.toLowerCase().includes(indicator.toLowerCase())
  )) {
    return true;
  }
  
  // Check if yourName field contains mock indicators (for legacy bookings)
  if (booking.yourName && mockIndicators.some(indicator => 
    booking.yourName.toLowerCase().includes(indicator.toLowerCase())
  )) {
    return true;
  }
  
  return false;
};

// Function to clear all localStorage keys and remove mock data
export const clearMockDataFromStorage = (): void => {
  console.log("=== Clearing Mock Data from All Storage Keys ===");
  
  const storageKeys = [
    'pendingBookings',
    'confirmedBookings', 
    'plannerCalendarBookings',
    'bookings', // Legacy key
    'appointments' // Another potential key
  ];
  
  storageKeys.forEach(key => {
    const stored = localStorage.getItem(key);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        const filtered = parsed.filter((booking: any) => !isMockBooking(booking));
        
        console.log(`${key}: removed ${parsed.length - filtered.length} mock bookings`);
        console.log(`${key}: ${filtered.length} real bookings remaining`);
        
        localStorage.setItem(key, JSON.stringify(filtered));
      } catch (error) {
        console.error(`Error processing ${key}:`, error);
      }
    }
  });
  
  console.log("=== Mock Data Cleanup Complete ===");
};

export const loadBookingsFromLocalStorage = (statusFilter?: string[]): Booking[] => {
  console.log("=== Loading from localStorage fallback ===");
  console.log("Status filter:", statusFilter);
  
  // First, clear any mock data
  clearMockDataFromStorage();
  
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
            // Skip mock bookings
            if (isMockBooking(booking)) {
              console.log(`Skipping mock booking: ${booking.id || 'no-id'} - ${booking.customer || booking.yourName || 'no-name'}`);
              return;
            }
            
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
