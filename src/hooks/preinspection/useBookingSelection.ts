
import { useEffect } from "react";
import { toast } from "sonner";
import { Booking } from "@/types/booking";
import { useBookingStatus } from "@/hooks/bookings/useBookingStatus";
import { useBookingStateManager } from "@/hooks/bookings/useBookingStateManager";

export const useBookingSelection = () => {
  const { updateBooking, moveBookingToConfirmed } = useBookingStateManager();
  const { updateBookingStatus } = useBookingStatus(updateBooking, moveBookingToConfirmed);

  const updateBookingDetails = (
    selectedBooking: string,
    appointments: Booking[],
    setBookingDetails: (booking: Booking | null) => void
  ) => {
    console.log("Updating booking details for:", selectedBooking);
    if (selectedBooking) {
      const selected = appointments.find(booking => booking.id === selectedBooking);
      if (selected) {
        console.log("Found selected booking:", selected);
        setBookingDetails(selected);
      } else {
        console.log("No booking found with ID:", selectedBooking);
        setBookingDetails(null);
      }
    } else {
      console.log("No booking selected, clearing details");
      setBookingDetails(null);
    }
  };

  const handleBookingSelected = (booking: Booking) => {
    console.log("Booking selected for inspection:", booking);
    if (booking.status === "confirmed") {
      updateBookingStatus(booking, "inspecting");
      toast.success(`${booking.customer}'s appointment is now being inspected.`);
    }
  };

  return {
    updateBookingDetails,
    handleBookingSelected
  };
};
