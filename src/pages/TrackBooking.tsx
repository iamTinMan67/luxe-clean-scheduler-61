
import { useParams } from "react-router-dom";
import TrackingSearchForm from "@/components/tracking/TrackingSearchForm";
import BookingValidation from "@/components/tracking/BookingValidation";

const TrackBooking = () => {
  const { bookingId } = useParams();
  
  // If bookingId is provided in URL, verify and display the tracking form
  if (bookingId) {
    return <BookingValidation bookingId={bookingId} />;
  }

  return <TrackingSearchForm />;
};

export default TrackBooking;
