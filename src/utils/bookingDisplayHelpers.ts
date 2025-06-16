
import { Booking } from "@/types/booking";

export const getDisplayTime = (booking: Booking): string => {
  return booking.time || booking.startTime || "Time TBD";
};

export const getDisplayPackage = (booking: Booking): string => {
  return booking.packageType || "Package TBD";
};

export const getDisplayStatus = (booking: Booking): string => {
  return booking.status || "pending";
};

export const getDisplayCustomer = (booking: Booking): string => {
  // Handle both customer and yourName fields (legacy data compatibility)
  const customerName = booking.customer || (booking as any).yourName || "Unknown Customer";
  return customerName.replace(/^:/, '').replace(/:$/, ''); // Remove leading/trailing colons
};

export const getDisplayVehicle = (booking: Booking): string => {
  return booking.vehicle || booking.jobDetails || "Unknown Vehicle";
};
