
import { Booking } from "@/types/booking";

export const getStatusInfo = (status: string) => {
  switch (status) {
    case "pending":
      return {
        color: "border-red-500 bg-red-950/30",
        label: "Pending",
        badgeColor: "red-600",
        textColor: "text-red-400",
        nextStatus: "confirmed",
        nextLabel: "Inspect"
      };
    case "confirmed":
      return {
        color: "border-orange-500 bg-orange-950/30",
        label: "Confirmed",
        badgeColor: "orange-600", 
        textColor: "text-orange-400",
        nextStatus: "in-progress",
        nextLabel: "Start Inspection"
      };
    case "in-progress":
      return {
        color: "border-blue-500 bg-blue-950/30",
        label: "In Progress",
        badgeColor: "blue-600",
        textColor: "text-blue-400",
        nextStatus: "completed",
        nextLabel: "Task Finish?"
      };
    case "completed":
      return {
        color: "border-purple-500 bg-purple-950/30",
        label: "Completed",
        badgeColor: "purple-600",
        textColor: "text-purple-400",
        nextStatus: "finished",
        nextLabel: "Finished?"
      };
    case "finished":
      return {
        color: "border-green-500 bg-green-950/30",
        label: "Finished",
        badgeColor: "green-600",
        textColor: "text-green-400",
        nextStatus: null,
        nextLabel: "Create Invoice?"
      };
    case "cancelled":
      return {
        color: "border-red-500 bg-red-950/30",
        label: "Cancelled",
        badgeColor: "red-600",
        textColor: "text-red-400",
        nextStatus: null,
        nextLabel: null
      };
    default:
      return {
        color: "border-gray-500 bg-gray-950/30",
        label: "Unknown",
        badgeColor: "gray-600",
        textColor: "text-gray-400",
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

export const getStatusTextColor = (status: string) => {
  return getStatusInfo(status).textColor;
};

export const getNextStatus = (booking: Booking) => {
  return getStatusInfo(booking.status).nextStatus;
};
