
import { useState, useEffect } from 'react';
import { Booking, validateBookingStatus } from '@/types/booking';
import { supabase } from '@/integrations/supabase/client';

export const useScheduledAppointments = (statusFilter?: string[]) => {
  const [appointments, setAppointments] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAppointments = async () => {
      setLoading(true);
      try {
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

        if (data) {
          // Transform data to match Booking type
          const transformedBookings: Booking[] = data.map(booking => {
            // Safely convert staff JSONB to string array
            let staff: string[] = [];
            if (Array.isArray(booking.staff)) {
              staff = booking.staff.filter((item): item is string => typeof item === 'string');
            }

            return {
              id: booking.id,
              customer: booking.customer_name, // Map to customer property
              vehicle: booking.vehicle_type, // Map to vehicle property  
              vehicleReg: '', // Default empty string since not in database
              jobDetails: booking.notes,
              secondVehicle: '', // Default empty string since not in database
              secondVehicleReg: '', // Default empty string since not in database
              packageType: booking.package_type,
              date: new Date(booking.date + 'T' + (booking.time || '09:00')),
              time: booking.time,
              startTime: booking.start_time,
              endTime: booking.end_time,
              location: booking.location,
              contact: booking.customer_phone,
              email: booking.customer_email,
              notes: booking.notes,
              status: validateBookingStatus(booking.status),
              condition: booking.condition || 5,
              staff: staff,
              createdAt: booking.created_at,
              totalPrice: booking.total_price,
              travelMinutes: 0, // Default value since not in database
              additionalServices: [], // Default empty array since not in database
              clientType: "private", // Default value since not in database
              vehicleType: booking.vehicle_type
            };
          });
          
          setAppointments(transformedBookings);
        } else {
          setAppointments([]);
        }
      } catch (error) {
        console.error('Error loading appointments from database:', error);
        
        // Fallback to localStorage for backward compatibility
        try {
          const confirmedBookings = localStorage.getItem('confirmedBookings');
          const pendingBookings = localStorage.getItem('pendingBookings');
          
          let allBookings: Booking[] = [];
          
          if (confirmedBookings) {
            const confirmed = JSON.parse(confirmedBookings);
            allBookings = [...allBookings, ...confirmed];
          }
          
          if (pendingBookings) {
            const pending = JSON.parse(pendingBookings);
            allBookings = [...allBookings, ...pending];
          }
          
          // Convert date strings to Date objects
          const processedBookings = allBookings.map(booking => ({
            ...booking,
            date: booking.date instanceof Date ? booking.date : new Date(booking.date)
          }));
          
          // Apply status filter if provided
          const filteredBookings = statusFilter && statusFilter.length > 0 
            ? processedBookings.filter(booking => statusFilter.includes(booking.status))
            : processedBookings;
          
          setAppointments(filteredBookings);
        } catch (localError) {
          console.error('Error loading from localStorage:', localError);
          setAppointments([]);
        }
      } finally {
        setLoading(false);
      }
    };

    loadAppointments();
    
    // Set up real-time subscription
    const subscription = supabase
      .channel('bookings-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'bookings' }, 
        () => {
          loadAppointments();
        }
      )
      .subscribe();
    
    return () => {
      subscription.unsubscribe();
    };
  }, [statusFilter]);

  return { appointments, loading };
};
