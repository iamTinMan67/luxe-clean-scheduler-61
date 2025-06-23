
import { useBookingIdValidation } from "@/hooks/tracking/useBookingIdValidation";
import TrackingFormV2 from "./TrackingFormV2";
import TrackingNotFound from "./TrackingNotFound";
import { Loader2 } from "lucide-react";

interface BookingValidationProps {
  bookingId: string;
}

const BookingValidation = ({ bookingId }: BookingValidationProps) => {
  const { isValid, isLoading } = useBookingIdValidation(bookingId);

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-gold" />
            <p className="text-gray-400">Validating booking...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!isValid) {
    return <TrackingNotFound />;
  }

  return <TrackingFormV2 bookingId={bookingId} />;
};

export default BookingValidation;
