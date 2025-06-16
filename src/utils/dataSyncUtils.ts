
import { syncMultipleBookingsToSupabase } from '@/services/bookingSyncService';
import { Booking } from '@/types/booking';
import { toast } from 'sonner';

export const syncLocalStorageToSupabase = async (): Promise<void> => {
  try {
    console.log('Starting localStorage to Supabase sync...');
    
    // Get all confirmed bookings from localStorage
    const confirmedBookings = localStorage.getItem('confirmedBookings') 
      ? JSON.parse(localStorage.getItem('confirmedBookings') || '[]') 
      : [];
    
    if (confirmedBookings.length === 0) {
      console.log('No confirmed bookings to sync');
      return;
    }
    
    console.log(`Found ${confirmedBookings.length} confirmed bookings to sync`);
    
    // Sync all confirmed bookings to Supabase
    const syncSuccess = await syncMultipleBookingsToSupabase(confirmedBookings);
    
    if (syncSuccess) {
      console.log('All bookings successfully synced to Supabase');
      toast.success('Local data synchronized with database');
    } else {
      console.warn('Some bookings failed to sync');
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
