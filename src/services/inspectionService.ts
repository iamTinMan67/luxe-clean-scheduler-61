
import { toast } from "@/components/ui/use-toast";
import { Booking } from "@/types/booking";

export const submitPreInspectionReport = (
  bookingDetails: Booking | null,
  images: string[],
  exteriorNotes: string,
  interiorNotes: string
): boolean => {
  if (!bookingDetails) {
    toast({
      variant: "destructive",
      description: "Please select a booking first"
    });
    return false;
  }

  if (images.length === 0) {
    toast({
      variant: "destructive",
      description: "No images uploaded. Consider adding vehicle condition photos."
    });
    return false;
  }

  // Update booking status to "in-progress" in localStorage
  const confirmedBookings = JSON.parse(localStorage.getItem('confirmedBookings') || '[]');
  const updatedBookings = confirmedBookings.map((booking: Booking) => {
    if (booking.id === bookingDetails.id) {
      return {
        ...booking,
        status: "in-progress"
      };
    }
    return booking;
  });
  
  localStorage.setItem('confirmedBookings', JSON.stringify(updatedBookings));
  
  // Also update in planner calendar bookings if it exists there
  const plannerBookings = JSON.parse(localStorage.getItem('plannerCalendarBookings') || '[]');
  const updatedPlannerBookings = plannerBookings.map((booking: Booking) => {
    if (booking.id === bookingDetails.id) {
      return {
        ...booking,
        status: "in-progress"
      };
    }
    return booking;
  });
  
  localStorage.setItem('plannerCalendarBookings', JSON.stringify(updatedPlannerBookings));

  // Save inspection report to localStorage
  const inspectionReport = {
    id: `ins-${Date.now()}`,
    bookingId: bookingDetails.id,
    exteriorNotes,
    interiorNotes,
    images,
    date: new Date().toISOString(),
    type: "pre" as const
  };
  
  const savedReports = JSON.parse(localStorage.getItem('inspectionReports') || '[]');
  localStorage.setItem('inspectionReports', JSON.stringify([...savedReports, inspectionReport]));
  
  toast({
    description: "Pre-inspection report has been saved and booking status updated to 'In Progress'",
  });

  return true;
};
