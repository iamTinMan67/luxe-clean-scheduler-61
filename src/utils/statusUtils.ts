
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
        nextLabel: "Confirm",
        actionLabel: "Confirm"
      };
    case "confirmed":
      return {
        color: "border-orange-500 bg-orange-950/30",
        label: "Confirmed",
        badgeColor: "orange-600", 
        textColor: "text-orange-400",
        nextStatus: "inspecting",
        nextLabel: "Start Inspection",
        actionLabel: "Start Inspection"
      };
    case "inspecting":
      return {
        color: "border-yellow-500 bg-yellow-950/30",
        label: "Inspecting",
        badgeColor: "yellow-600",
        textColor: "text-yellow-400",
        nextStatus: "inspected",
        nextLabel: "Complete Inspection",
        actionLabel: "Complete Inspection"
      };
    case "inspected":
      return {
        color: "border-teal-500 bg-teal-950/30",
        label: "Inspected",
        badgeColor: "teal-600",
        textColor: "text-teal-400",
        nextStatus: "in-progress",
        nextLabel: "Start Service",
        actionLabel: "Start Service"
      };
    case "in-progress":
      return {
        color: "border-blue-500 bg-blue-950/30",
        label: "In Progress",
        badgeColor: "blue-600",
        textColor: "text-blue-400",
        nextStatus: "finished",
        nextLabel: "Finish Service",
        actionLabel: "Finish Service"
      };
    case "finished":
      return {
        color: "border-green-500 bg-green-950/30",
        label: "Finished",
        badgeColor: "green-600",
        textColor: "text-green-400",
        nextStatus: null,
        nextLabel: null,
        actionLabel: null
      };
    case "cancelled":
      return {
        color: "border-red-500 bg-red-950/30",
        label: "Cancelled",
        badgeColor: "red-600",
        textColor: "text-red-400",
        nextStatus: null,
        nextLabel: null,
        actionLabel: null
      };
    default:
      return {
        color: "border-gray-500 bg-gray-950/30",
        label: "Unknown",
        badgeColor: "gray-600",
        textColor: "text-gray-400",
        nextStatus: null,
        nextLabel: null,
        actionLabel: null
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
