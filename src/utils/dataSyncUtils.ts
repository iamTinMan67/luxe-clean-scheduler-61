
import { syncMultipleBookingsToSupabase } from '@/services/bookingSyncService';
import { Booking } from '@/types/booking';

export const syncLocalStorageToSupabase = async (): Promise<void> => {
  try {
    console.log('=== Starting silent localStorage to Supabase sync ===');
    
    // Collect all bookings from different localStorage sources
    let allBookingsToSync: Booking[] = [];
    
    // Get confirmed bookings
    const confirmedBookings = localStorage.getItem('confirmedBookings') 
      ? JSON.parse(localStorage.getItem('confirmedBookings') || '[]') 
      : [];
    
    // Get planner calendar bookings
    const plannerCalendarBookings = localStorage.getItem('plannerCalendarBookings') 
      ? JSON.parse(localStorage.getItem('plannerCalendarBookings') || '[]') 
      : [];
    
    // Merge all bookings, avoiding duplicates
    const existingIds = new Set();
    
    [...confirmedBookings, ...plannerCalendarBookings].forEach((booking: any) => {
      if (!existingIds.has(booking.id)) {
        // Ensure the booking has proper date format and required fields
        const normalizedBooking: Booking = {
          ...booking,
          date: booking.date instanceof Date ? booking.date : new Date(booking.date),
          status: booking.status || 'confirmed',
          // Ensure required fields have defaults
          customer: booking.customer || booking.yourName || 'Unknown Customer',
          vehicle: booking.vehicle || booking.jobDetails || 'Unknown Vehicle',
          packageType: booking.packageType || 'main',
          location: booking.location || booking.postcode || 'Unknown Location',
          totalPrice: booking.totalPrice || 0
        };
        allBookingsToSync.push(normalizedBooking);
        existingIds.add(booking.id);
      }
    });
    
    console.log(`Found ${allBookingsToSync.length} unique bookings to sync from localStorage`);
    
    if (allBookingsToSync.length === 0) {
      console.log('No bookings to sync');
      return;
    }
    
    // Sync all bookings to Supabase silently
    const syncSuccess = await syncMultipleBookingsToSupabase(allBookingsToSync);
    
    if (syncSuccess) {
      console.log('=== Silent sync completed successfully ===');
    } else {
      console.warn('=== Partial sync completed - some bookings may have UUID format issues ===');
    }
    
  } catch (error) {
    console.error('Error during silent data sync:', error);
  }
};

export const manualDataSync = async (): Promise<boolean> => {
  try {
    console.log('Manual sync requested');
    await syncLocalStorageToSupabase();
    console.log('Manual sync completed successfully');
    return true;
  } catch (error) {
    console.error('Manual sync failed:', error);
    return false;
  }
};
