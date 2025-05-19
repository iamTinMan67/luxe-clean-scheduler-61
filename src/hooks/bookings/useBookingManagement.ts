
import { Booking } from '@/types/booking';
import { toast } from 'sonner';
import { packageOptions, additionalServices } from '@/data/servicePackageData';
import { generateInvoice } from '@/utils/bookingUtils';
import { useBookingStateManager } from './useBookingStateManager';

export const useBookingManagement = () => {
  const { 
    pendingBookings,
    confirmedBookings,
    updateBooking,
    moveBookingToConfirmed
  } = useBookingStateManager();

  // Handler for updating booking status
  const handleUpdateStatus = (booking: Booking, newStatus: "confirmed" | "in-progress" | "completed" | "finished") => {
    // If the booking is pending and we're confirming it, use the confirmation handler
    if (booking.status === "pending" && newStatus === "confirmed") {
      handleConfirmBooking(booking);
      return;
    }
    
    // Update the booking status
    const updatedBooking = { ...booking, status: newStatus };
    updateBooking(updatedBooking);
    
    // If status is finished, trigger invoice generation
    if (newStatus === "finished") {
      generateInvoice(booking);
    }
    
    // If status is in-progress, populate To-Do list
    if (newStatus === "in-progress") {
      populateToDoList(booking);
    }
    
    toast.success(`${booking.customer}'s booking has been updated to ${newStatus}.`);
  };
  
  // Helper function to populate To-Do list
  const populateToDoList = (booking: Booking) => {
    // Find the package
    const packageOption = packageOptions.find(p => p.type === booking.packageType);
    
    if (packageOption) {
      // Create service tasks
      const serviceTasks = packageOption.tasks.map(task => ({
        id: `${task.id}-${booking.id}`,
        name: task.name,
        completed: false,
        allocatedTime: task.duration,
        appointment_id: booking.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }));
      
      // Add additional services if present
      if (booking.additionalServices && Array.isArray(booking.additionalServices)) {
        booking.additionalServices.forEach(serviceId => {
          const service = additionalServices.find(s => s.id === serviceId);
          if (service) {
            serviceTasks.push({
              id: `${service.id}-${booking.id}`,
              name: service.name,
              completed: false,
              allocatedTime: service.duration || 30, // Default 30 mins
              appointment_id: booking.id,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            });
          }
        });
      }
      
      // Save to localStorage
      const existingTasks = JSON.parse(localStorage.getItem('serviceTasks') || '[]');
      localStorage.setItem('serviceTasks', JSON.stringify([...existingTasks, ...serviceTasks]));
      
      toast.success(`${serviceTasks.length} tasks added to the To-Do list.`);
    }
  };
  
  // Handler for confirming a booking
  const handleConfirmBooking = (booking: Booking) => {
    // Update booking status to confirmed
    const updatedBooking = {
      ...booking,
      status: 'confirmed' as const,
      // Default staff assignment if not already assigned
      staff: booking.staff || ['Staff1', 'Staff2'],
      // Default travel time if not set
      travelMinutes: booking.travelMinutes || 15
    };
    
    // Move from pending to confirmed
    moveBookingToConfirmed(updatedBooking);
    
    // Generate invoice
    generateInvoice(updatedBooking);
    
    toast.success(`${booking.customer}'s booking has been confirmed.`);
  };
  
  // Handler for completing a booking
  const handleCompleteBooking = (booking: Booking) => {
    // Update booking status to completed
    const updatedBooking = {
      ...booking,
      status: 'completed' as const
    };
    
    // Update the booking
    updateBooking(updatedBooking);
    
    toast.success(`${booking.customer}'s booking has been marked as completed.`);
  };

  return {
    handleConfirmBooking,
    handleCompleteBooking,
    handleUpdateStatus
  };
};
