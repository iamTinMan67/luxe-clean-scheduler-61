
import { toast } from "sonner";

export const showBookingSuccessNotification = (): void => {
  toast.success("Booking Request Submitted!", {
    description: "We'll contact you soon to discuss your requirements and provide a quote.",
    style: {
      background: '#f97316', // Orange background
      color: 'white',
      border: '1px solid #ea580c'
    }
  });
};

export const showBookingErrorNotification = (): void => {
  toast.error("Something went wrong", {
    description: "Please try again or contact us directly."
  });
};
