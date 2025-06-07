
import { Booking } from "@/types/booking";
import { ProgressBooking } from "@/hooks/progress/types";

/**
 * Converts a Booking object to a ProgressBooking object
 */
export const bookingToProgressBooking = (booking: Booking): ProgressBooking => {
  return {
    id: booking.id,
    customerName: booking.customer,
    vehicleType: booking.vehicle,
    packageType: booking.packageType,
    date: booking.date instanceof Date ? booking.date.toISOString() : booking.date as string,
    time: booking.time || "",
    location: booking.location,
    status: booking.status === "finished" ? "completed" : 
           booking.status === "in-progress" ? "in-progress" : 
           booking.status === "confirmed" ? "confirmed" : "pending",
    progressPercentage: 0,
    totalPrice: booking.totalPrice || 0,
    steps: [
      { id: 1, name: "Booking Confirmed", completed: true, time: new Date().toISOString() },
      { id: 2, name: "Pre-inspection Completed", completed: false }
    ]
  };
};
