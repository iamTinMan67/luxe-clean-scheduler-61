
import { Booking } from '@/types/booking';

export const logAppointmentDebugInfo = (
  appointments: Booking[], 
  loading: boolean, 
  statusFilter?: string[]
) => {
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
};
