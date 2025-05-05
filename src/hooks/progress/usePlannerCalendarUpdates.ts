
import { ProgressBooking } from "./types";

export const usePlannerCalendarUpdates = () => {
  // Function to update planner calendar status
  const updatePlannerCalendar = (booking: ProgressBooking) => {
    // Get bookings from localStorage
    const pendingBookingsStr = localStorage.getItem('pendingBookings');
    const confirmedBookingsStr = localStorage.getItem('confirmedBookings');
    
    try {
      // Update pending bookings if they exist
      if (pendingBookingsStr) {
        const pendingBookings = JSON.parse(pendingBookingsStr);
        // Find the current booking in pendingBookings by ID and update its status
        const updatedPendingBookings = pendingBookings.filter((b: any) => b.id !== booking.id);
        localStorage.setItem('pendingBookings', JSON.stringify(updatedPendingBookings));
      }
      
      // Update confirmed bookings if they exist
      if (confirmedBookingsStr) {
        const confirmedBookings = JSON.parse(confirmedBookingsStr);
        // Find the current booking in confirmedBookings by ID and update its status or add it
        const existingIndex = confirmedBookings.findIndex((b: any) => b.id === booking.id);
        
        if (existingIndex >= 0) {
          // Update existing booking
          confirmedBookings[existingIndex] = { 
            ...confirmedBookings[existingIndex], 
            status: "completed",
            totalPrice: booking.totalPrice
          };
        } else {
          // Add new completed booking
          confirmedBookings.push({
            id: booking.id,
            customer: booking.customerName,
            vehicle: booking.vehicleType,
            packageType: booking.packageType,
            date: new Date(booking.date),
            time: booking.time,
            startTime: booking.time,
            endTime: `${parseInt(booking.time.split(':')[0]) + 2}:${booking.time.split(':')[1]}`,
            location: booking.location,
            status: "completed",
            totalPrice: booking.totalPrice
          });
        }
        
        localStorage.setItem('confirmedBookings', JSON.stringify(confirmedBookings));
      } else {
        // Create confirmedBookings if it doesn't exist
        const newCompletedBooking = {
          id: booking.id,
          customer: booking.customerName,
          vehicle: booking.vehicleType,
          packageType: booking.packageType,
          date: new Date(booking.date),
          time: booking.time,
          startTime: booking.time,
          endTime: `${parseInt(booking.time.split(':')[0]) + 2}:${booking.time.split(':')[1]}`,
          location: booking.location,
          status: "completed",
          totalPrice: booking.totalPrice
        };
        localStorage.setItem('confirmedBookings', JSON.stringify([newCompletedBooking]));
      }
      
      console.log("Updated booking status in planner calendar:", booking.id);
    } catch (error) {
      console.error("Error updating planner calendar:", error);
    }
  };

  return {
    updatePlannerCalendar
  };
};
