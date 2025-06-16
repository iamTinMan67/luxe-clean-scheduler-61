
import { supabase } from '@/integrations/supabase/client';
import { Booking } from '@/types/booking';
import { transformSupabaseBooking, logTransformedBooking, SupabaseBookingData } from '@/utils/bookingDataTransformer';

export const fetchBookingsFromSupabase = async (statusFilter?: string[]): Promise<Booking[]> => {
  console.log("Loading appointments with status filter:", statusFilter);
  
  // Get bookings from Supabase
  let query = supabase
    .from("bookings")
    .select("*");

  // Apply status filter if provided
  if (statusFilter && statusFilter.length > 0) {
    query = query.in('status', statusFilter);
  }

  const { data, error } = await query;
  
  if (error) {
    throw error;
  }

  if (!data) {
    console.log("No data returned from Supabase");
    return [];
  }

  console.log("Raw Supabase data:", data);
  
  // Transform data to match Booking type
  const transformedBookings: Booking[] = data.map((booking: SupabaseBookingData) => {
    const transformedBooking = transformSupabaseBooking(booking);
    logTransformedBooking(transformedBooking);
    return transformedBooking;
  });
  
  console.log("Total transformed bookings:", transformedBookings.length);
  return transformedBookings;
};
