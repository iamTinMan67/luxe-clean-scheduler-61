
import { useState } from 'react';
import { Booking } from '@/types/booking';
import { toast } from 'sonner';
import { useBookingStateManager } from '@/hooks/bookings/useBookingStateManager';

export const useBookingStatusTransition = () => {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const { updateBooking } = useBookingStateManager();

  const transitionBookingStatus = async (booking: Booking, newStatus: Booking['status']) => {
    if (isTransitioning) return;

    setIsTransitioning(true);
    
    try {
      const updatedBooking: Booking = {
        ...booking,
        status: newStatus
      };

      await updateBooking(updatedBooking);
      
      // Show success message
      const statusMessages = {
        'confirmed': 'Booking confirmed successfully',
        'inspecting': 'Inspection started',
        'inspected': 'Inspection completed',
        'in-progress': 'Service started',
        'finished': 'Service completed',
        'cancelled': 'Booking cancelled'
      };

      toast.success(statusMessages[newStatus] || `Status updated to ${newStatus}`);
      
    } catch (error) {
      console.error('Error transitioning booking status:', error);
      toast.error('Failed to update booking status');
    } finally {
      setIsTransitioning(false);
    }
  };

  return {
    transitionBookingStatus,
    isTransitioning
  };
};
