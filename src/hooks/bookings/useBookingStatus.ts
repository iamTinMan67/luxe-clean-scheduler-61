
import { Booking } from "@/types/booking";
import { toast } from "sonner";
import { packageOptions, additionalServices } from "@/data/servicePackageData";
import { generateInvoice } from "@/utils/bookingUtils";
import { getStatusInfo } from "@/utils/statusUtils";

export const useBookingStatus = (
  updateBooking: (booking: Booking) => Booking[],
  moveBookingToConfirmed: (booking: Booking) => void
) => {
  // Get next status from current status
  const getNextBookingStatus = (booking: Booking): string | null => {
    return getStatusInfo(booking.status).nextStatus;
  };

  // Get next status label from current status
  const getNextStatusLabel = (booking: Booking): string | null => {
    return getStatusInfo(booking.status).nextLabel;
  };

  // Handler for updating booking status
  const updateBookingStatus = (booking: Booking, newStatus: "confirmed" | "in-progress" | "completed" | "finished" | "cancelled" | "pending") => {
    // If the booking is pending and we're confirming it, use the special confirmation handler
    if (booking.status === "pending" && newStatus === "confirmed") {
      confirmBooking(booking);
      return;
    }
    
    // Update the booking status - ensure we're using the correct type
    const updatedBooking = { 
      ...booking, 
      status: newStatus as "pending" | "confirmed" | "cancelled" | "in-progress" | "completed" | "finished"
    };
    
    updateBooking(updatedBooking);
    
    // Status-specific actions
    switch(newStatus) {
      case "finished":
        generateInvoice(booking);
        break;
      case "in-progress":
        populateToDoList(booking);
        break;
      default:
        break;
    }
    
    toast.success(`${booking.customer}'s booking has been updated to ${newStatus}.`);
  };
  
  // Handler for confirming a booking (special case)
  const confirmBooking = (booking: Booking) => {
    // Update booking status to confirmed
    const updatedBooking = {
      ...booking,
      status: 'confirmed' as const,
      // Default staff assignment if not already assigned
      staff: booking.staff || ['Karl', 'Salleah'],
      // Default travel time if not set
      travelMinutes: booking.travelMinutes || 15
    };
    
    // Move from pending to confirmed
    moveBookingToConfirmed(updatedBooking);
    
    // Generate invoice
    generateInvoice(updatedBooking);
    
    toast.success(`${booking.customer}'s booking has been confirmed.`);
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
  
  // Complete a booking (transition to completed state)
  const completeBooking = (booking: Booking) => {
    updateBookingStatus(booking, 'completed');
  };

  return {
    getNextBookingStatus,
    getNextStatusLabel,
    updateBookingStatus,
    confirmBooking,
    completeBooking
  };
};
