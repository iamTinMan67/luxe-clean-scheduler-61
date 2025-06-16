
import { Booking } from "@/types/booking";
import { isSameDay, getTodayString } from "./dateParsingUtils";
import { getDisplayCustomer } from "./bookingDisplayHelpers";

export const filterTodayAppointments = (appointments: Booking[]): Booking[] => {
  const todayAppointments = appointments.filter(booking => {
    console.log("=== BookingSelector Filter Debug ===");
    console.log("Processing booking:", {
      id: booking.id,
      customer: getDisplayCustomer(booking),
      date: booking.date,
      status: booking.status,
      dateType: typeof booking.date,
      rawDate: booking.date
    });

    try {
      const today = new Date();
      const isToday = isSameDay(booking.date, today);
      // More flexible status checking - include various confirmed statuses
      const isValidStatus = booking.status === "confirmed" || 
                           booking.status === "inspecting" || 
                           booking.status === "inspected" ||
                           booking.status === "in-progress";
      
      console.log("Booking filter check:", {
        id: booking.id,
        customer: getDisplayCustomer(booking),
        isToday,
        isValidStatus,
        status: booking.status,
        shouldInclude: isToday && isValidStatus
      });

      return isToday && isValidStatus;
    } catch (error) {
      console.error("Error processing booking date:", error, booking);
      return false;
    }
  });

  console.log("=== BookingSelector Final Results ===");
  console.log("Total appointments received:", appointments.length);
  console.log("All appointment statuses:", appointments.map(a => `${getDisplayCustomer(a)}:${a.status}`));
  console.log("Today's valid appointments:", todayAppointments.length);
  console.log("Today's date:", getTodayString());
  console.log("Valid appointments for today:", todayAppointments.map(a => ({
    id: a.id,
    customer: getDisplayCustomer(a),
    status: a.status,
    date: a.date,
    time: a.time,
    packageType: a.packageType,
    vehicle: a.vehicle
  })));

  return todayAppointments;
};
