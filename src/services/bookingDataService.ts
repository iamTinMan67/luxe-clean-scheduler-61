
import { supabase } from '@/integrations/supabase/client';
import { Booking } from '@/types/booking';

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
  const transformedBookings: Booking[] = data.map((booking: any) => {
    const transformedBooking: Booking = {
      id: booking.id,
      customer: booking.customer_name || booking.customer || '',
      vehicle: booking.vehicle_type || booking.vehicle || '',
      vehicleReg: booking.vehicle_reg || '',
      jobDetails: booking.job_details || '',
      packageType: booking.package_type || 'medium',
      date: new Date(booking.date),
      time: booking.time || '',
      location: booking.location || '',
      contact: booking.customer_phone || booking.contact || '',
      email: booking.customer_email || booking.email || '',
      notes: booking.notes || '',
      status: booking.status || 'pending',
      clientType: booking.client_type || 'private',
      jobType: booking.job_type || 'car'
    };
    
    console.log("Transformed booking:", transformedBooking);
    return transformedBooking;
  });
  
  console.log("Total transformed bookings:", transformedBookings.length);
  return transformedBookings;
};
