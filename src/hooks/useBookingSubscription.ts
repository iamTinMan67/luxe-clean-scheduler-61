
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useBookingSubscription = (onBookingChange: () => void) => {
  useEffect(() => {
    // Set up real-time subscription for immediate updates
    const subscription = supabase
      .channel('bookings-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'bookings' }, 
        (payload) => {
          console.log('Real-time booking update:', payload);
          onBookingChange(); // Trigger reload when changes occur
        }
      )
      .subscribe();
    
    return () => {
      subscription.unsubscribe();
    };
  }, [onBookingChange]);
};
