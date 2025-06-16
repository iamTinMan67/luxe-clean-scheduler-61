
import { syncMultipleBookingsToSupabase } from '@/services/bookingSyncService';
import { Booking } from '@/types/booking';
import { toast } from 'sonner';

export const syncLocalStorageToSupabase = async (): Promise<void> => {
  try {
    console.log('=== Starting localStorage to Supabase sync ===');
    
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
        // Ensure the booking has proper date format
        const normalizedBooking: Booking = {
          ...booking,
          date: booking.date instanceof Date ? booking.date : new Date(booking.date),
          status: booking.status || 'confirmed'
        };
        allBookingsToSync.push(normalizedBooking);
        existingIds.add(booking.id);
      }
    });
    
    console.log(`Found ${allBookingsToSync.length} unique bookings to sync from localStorage`);
    console.log('Bookings to sync:', allBookingsToSync.map(b => ({
      id: b.id,
      customer: b.customer,
      status: b.status,
      date: b.date
    })));
    
    if (allBookingsToSync.length === 0) {
      console.log('No bookings to sync');
      return;
    }
    
    // Sync all bookings to Supabase
    const syncSuccess = await syncMultipleBookingsToSupabase(allBookingsToSync);
    
    if (syncSuccess) {
      console.log('=== Sync completed successfully ===');
      toast.success('Local data synchronized with database');
    } else {
      console.warn('=== Partial sync completed ===');
      toast.warning('Partial sync completed - some data may not be synchronized');
    }
    
  } catch (error) {
    console.error('Error during data sync:', error);
    toast.error('Failed to synchronize local data with database');
  }
};

export const manualDataSync = async (): Promise<boolean> => {
  try {
    await syncLocalStorageToSupabase();
    return true;
  } catch (error) {
    console.error('Manual sync failed:', error);
    return false;
  }
};
