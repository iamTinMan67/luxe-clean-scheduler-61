
import { Booking } from "@/types/booking";

export const getStatusInfo = (status: string) => {
  switch (status) {
    case "pending":
      return {
        color: "border-amber-500 bg-amber-950/30",
        label: "Pending",
        badgeColor: "bg-amber-600",
        nextStatus: "confirmed",
        nextLabel: "Confirm"
      };
    case "confirmed":
      return {
        color: "border-blue-500 bg-blue-950/30",
        label: "Confirmed",
        badgeColor: "bg-blue-600",
        nextStatus: "in-progress",
        nextLabel: "Start Service"
      };
    case "in-progress":
      return {
        color: "border-purple-500 bg-purple-950/30",
        label: "In Progress",
        badgeColor: "bg-purple-600",
        nextStatus: "completed",
        nextLabel: "Complete"
      };
    case "completed":
      return {
        color: "border-green-500 bg-green-950/30",
        label: "Completed",
        badgeColor: "bg-green-600",
        nextStatus: "finished",
        nextLabel: "Finalize"
      };
    case "finished":
      return {
        color: "border-gold bg-gold/10",
        label: "Finished",
        badgeColor: "bg-gold",
        nextStatus: null,
        nextLabel: null
      };
    case "cancelled":
      return {
        color: "border-red-500 bg-red-950/30",
        label: "Cancelled",
        badgeColor: "bg-red-600",
        nextStatus: null,
        nextLabel: null
      };
    default:
      return {
        color: "border-gray-500 bg-gray-950/30",
        label: "Unknown",
        badgeColor: "bg-gray-600",
        nextStatus: null,
        nextLabel: null
      };
  }
};

export const getStatusLabel = (status: string) => {
  return getStatusInfo(status).label;
};

export const getStatusColor = (status: string) => {
  return getStatusInfo(status).color;
};

export const getNextStatus = (booking: Booking) => {
  return getStatusInfo(booking.status).nextStatus;
};
