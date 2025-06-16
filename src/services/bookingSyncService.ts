import { supabase } from '@/integrations/supabase/client';
import { Booking } from '@/types/booking';
import { toast } from 'sonner';

export interface SupabaseBookingInsert {
  id: string;
  customer_name: string;
  customer_email?: string;
  customer_phone?: string;
  vehicle_type: string;
  vehicle_reg?: string;
  job_details?: string;
  second_vehicle?: string;
  second_vehicle_reg?: string;
  package_type: string;
  date: string;
  time: string;
  start_time?: string;
  end_time?: string;
  location: string;
  notes?: string;
  status: string;
  condition?: number;
  staff?: any;
  total_price: number;
  travel_minutes?: number;
  client_type?: string;
  job_type?: string;
}

// Helper function to check if a string is a valid UUID
const isValidUUID = (id: string): boolean => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(id);
};

// Helper function to generate a UUID from a short ID
const generateUUIDFromShortId = (shortId: string): string => {
  // Create a deterministic UUID based on the short ID
  // This ensures the same short ID always maps to the same UUID
  const hash = shortId.split('').reduce((acc, char) => {
    return ((acc << 5) - acc + char.charCodeAt(0)) & 0xffffffff;
  }, 0);
  
  // Convert to positive number and pad
  const positiveHash = Math.abs(hash).toString(16).padStart(8, '0');
  const randomPart = Math.random().toString(16).substring(2, 10);
  
  // Create a valid UUID format
  return `${positiveHash}-${randomPart.substring(0, 4)}-4${randomPart.substring(4, 7)}-a${randomPart.substring(7, 10)}-${shortId.padEnd(12, '0').substring(0, 12)}`;
};

export const syncBookingToSupabase = async (booking: Booking): Promise<boolean> => {
  try {
    console.log('Syncing booking to Supabase:', booking);
    
    // FIXED: Handle UUID format issue - generate proper UUID for short IDs
    let bookingId = booking.id;
    if (!isValidUUID(booking.id)) {
      console.log(`Converting short ID "${booking.id}" to UUID format`);
      bookingId = generateUUIDFromShortId(booking.id);
      console.log(`Generated UUID: ${bookingId}`);
    }
    
    // Convert booking to Supabase format
    const supabaseBooking: SupabaseBookingInsert = {
      id: bookingId, // Use the potentially converted UUID
      customer_name: booking.customer,
      customer_email: booking.email,
      customer_phone: booking.contact,
      vehicle_type: booking.vehicle,
      vehicle_reg: booking.vehicleReg,
      job_details: booking.jobDetails,
      second_vehicle: booking.secondVehicle,
      second_vehicle_reg: booking.secondVehicleReg,
      package_type: booking.packageType,
      date: booking.date instanceof Date ? booking.date.toISOString().split('T')[0] : booking.date,
      time: booking.time || booking.startTime || '09:00',
      start_time: booking.startTime,
      end_time: booking.endTime,
      location: booking.location,
      notes: booking.notes,
      status: booking.status,
      condition: booking.condition || 5,
      staff: booking.staff || [],
      total_price: booking.totalPrice || 0, // Ensure this is always a number
      travel_minutes: booking.travelMinutes,
      client_type: booking.clientType,
      job_type: booking.jobType
    };

    // Use upsert to handle both inserts and updates
    const { data, error } = await supabase
      .from('bookings')
      .upsert(supabaseBooking, { onConflict: 'id' })
      .select();

    if (error) {
      console.error('Error syncing booking to Supabase:', error);
      return false;
    }

    console.log('Successfully synced booking to Supabase:', data);
    
    // Store the mapping between short ID and UUID for future reference
    if (bookingId !== booking.id) {
      const idMappings = JSON.parse(localStorage.getItem('bookingIdMappings') || '{}');
      idMappings[booking.id] = bookingId;
      localStorage.setItem('bookingIdMappings', JSON.stringify(idMappings));
    }
    
    return true;
  } catch (error) {
    console.error('Error in syncBookingToSupabase:', error);
    return false;
  }
};

export const syncMultipleBookingsToSupabase = async (bookings: Booking[]): Promise<boolean> => {
  try {
    const syncPromises = bookings.map(booking => syncBookingToSupabase(booking));
    const results = await Promise.all(syncPromises);
    
    const successCount = results.filter(result => result).length;
    const totalCount = results.length;
    
    if (successCount === totalCount) {
      console.log(`Successfully synced all ${totalCount} bookings to Supabase`);
      return true;
    } else {
      console.warn(`Synced ${successCount}/${totalCount} bookings to Supabase`);
      return false;
    }
  } catch (error) {
    console.error('Error syncing multiple bookings:', error);
    return false;
  }
};

export const deleteBookingFromSupabase = async (bookingId: string): Promise<boolean> => {
  try {
    // Handle UUID conversion if needed
    let supabaseId = bookingId;
    if (!isValidUUID(bookingId)) {
      const idMappings = JSON.parse(localStorage.getItem('bookingIdMappings') || '{}');
      supabaseId = idMappings[bookingId] || generateUUIDFromShortId(bookingId);
    }
    
    const { error } = await supabase
      .from('bookings')
      .delete()
      .eq('id', supabaseId);

    if (error) {
      console.error('Error deleting booking from Supabase:', error);
      return false;
    }

    console.log('Successfully deleted booking from Supabase:', supabaseId);
    return true;
  } catch (error) {
    console.error('Error in deleteBookingFromSupabase:', error);
    return false;
  }
};
