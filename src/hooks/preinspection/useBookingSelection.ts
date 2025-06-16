
import { useEffect } from "react";
import { toast } from "sonner";
import { Booking } from "@/types/booking";
import { useBookingStateManager } from "@/hooks/bookings/useBookingStateManager";

export const useBookingSelection = () => {
  const { updateBooking, moveBookingToConfirmed } = useBookingStateManager();

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

  const handleBookingSelected = async (booking: Booking) => {
    console.log("Booking selected for inspection:", booking);
    // Note: We no longer automatically change status here, it's done via Start Inspection button
    toast.success(`${booking.customer}'s appointment selected for inspection.`);
  };

  const handleStartInspection = async (booking: Booking) => {
    console.log("Starting inspection for booking:", booking);
    if (booking.status === "confirmed") {
      const updatedBooking = { ...booking, status: "in-progress" as const };
      await updateBooking(updatedBooking);
      toast.success(`Inspection started for ${booking.customer}'s appointment.`);
    }
  };

  return {
    updateBookingDetails,
    handleBookingSelected,
    handleStartInspection
  };
};
