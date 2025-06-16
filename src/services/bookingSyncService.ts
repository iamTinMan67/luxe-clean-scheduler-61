
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
  total_price?: number;
  travel_minutes?: number;
  client_type?: string;
  job_type?: string;
}

export const syncBookingToSupabase = async (booking: Booking): Promise<boolean> => {
  try {
    console.log('Syncing booking to Supabase:', booking);
    
    // Convert booking to Supabase format
    const supabaseBooking: SupabaseBookingInsert = {
      id: booking.id,
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
      total_price: booking.totalPrice,
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
    const { error } = await supabase
      .from('bookings')
      .delete()
      .eq('id', bookingId);

    if (error) {
      console.error('Error deleting booking from Supabase:', error);
      return false;
    }

    console.log('Successfully deleted booking from Supabase:', bookingId);
    return true;
  } catch (error) {
    console.error('Error in deleteBookingFromSupabase:', error);
    return false;
  }
};
