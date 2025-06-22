
import React from 'react';

interface BookingStatusBadgeProps {
  status: "pending" | "confirmed" | "cancelled" | "inspecting" | "inspected" | "in-progress" | "finished";
}

const BookingStatusBadge: React.FC<BookingStatusBadgeProps> = ({ status }) => {
  const getStatusStyles = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-amber-900/30 text-amber-400 border border-amber-700";
      case "confirmed":
        return "bg-green-900/30 text-green-400 border border-green-700";
      case "inspecting":
        return "bg-orange-900/30 text-orange-400 border border-orange-700";
      case "inspected":
        return "bg-teal-900/30 text-teal-400 border border-teal-700";
      case "in-progress":
        return "bg-blue-900/30 text-blue-400 border border-blue-700";
      case "finished":
        return "bg-purple-900/30 text-purple-400 border border-purple-700";
      default:
        return "bg-gray-900/30 text-gray-400 border border-gray-700";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "in-progress":
        return "In Progress";
      default:
        return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };

  return (
    <span className={`text-xs px-2 py-1 rounded-full ${getStatusStyles(status)}`}>
      {getStatusLabel(status)}
    </span>
  );
};

export default BookingStatusBadge;
