
import { useState, useEffect } from 'react';
import { Booking, validateBookingStatus } from '@/types/booking';
import { supabase } from '@/integrations/supabase/client';

export const useScheduledAppointments = (statusFilter?: string[]) => {
  const [appointments, setAppointments] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAppointments = async () => {
      setLoading(true);
      console.log("Loading appointments with status filter:", statusFilter);
      
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
          console.log("Raw Supabase data:", data);
          
          // Transform data to match Booking type
          const transformedBookings: Booking[] = data.map(booking => {
            // Safely convert staff JSONB to string array
            let staff: string[] = [];
            if (Array.isArray(booking.staff)) {
              staff = booking.staff.filter((item): item is string => typeof item === 'string');
            }

            const transformedBooking: Booking = {
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

            // Properly convert date to Date object before calling toDateString
            const bookingDate = transformedBooking.date instanceof Date ? transformedBooking.date : new Date(transformedBooking.date);
            
            console.log("Transformed booking:", {
              id: transformedBooking.id,
              customer: transformedBooking.customer,
              status: transformedBooking.status,
              date: transformedBooking.date,
              dateString: bookingDate.toDateString()
            });

            return transformedBooking;
          });
          
          console.log("Total transformed bookings:", transformedBookings.length);
          setAppointments(transformedBookings);
        } else {
          console.log("No data returned from Supabase");
          setAppointments([]);
        }
      } catch (error) {
        console.error('Error loading appointments from database:', error);
        
        // Fallback to localStorage for backward compatibility
        try {
          console.log("Falling back to localStorage");
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
          
          console.log("Loaded from localStorage:", filteredBookings.length, "bookings");
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
    
    // Set up real-time subscription for immediate updates
    const subscription = supabase
      .channel('bookings-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'bookings' }, 
        (payload) => {
          console.log('Real-time booking update:', payload);
          loadAppointments(); // Reload data when changes occur
        }
      )
      .subscribe();
    
    return () => {
      subscription.unsubscribe();
    };
  }, [statusFilter]);

  // Additional debug logging
  useEffect(() => {
    console.log("=== useScheduledAppointments Debug ===");
    console.log("Current appointments count:", appointments.length);
    console.log("Loading state:", loading);
    console.log("Status filter:", statusFilter);
    
    const todayString = new Date().toDateString();
    const todayConfirmed = appointments.filter(booking => {
      const bookingDate = booking.date instanceof Date ? booking.date : new Date(booking.date);
      return bookingDate.toDateString() === todayString && booking.status === "confirmed";
    });
    
    console.log("Today's confirmed bookings:", todayConfirmed.length);
    console.log("Today's confirmed booking details:", todayConfirmed.map(b => {
      const bookingDate = b.date instanceof Date ? b.date : new Date(b.date);
      return {
        id: b.id,
        customer: b.customer,
        status: b.status,
        date: bookingDate.toDateString()
      };
    }));
  }, [appointments, loading, statusFilter]);

  return { appointments, loading };
};
