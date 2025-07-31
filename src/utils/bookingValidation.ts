
import { toast } from "sonner";
import { validateAndSanitizeBookingData, BookingFormData } from "./inputSanitizer";

interface FormData {
  yourName: string;
  postcode: string;
  phone: string;
  email: string;
  notes: string;
  jobDetails: string;
  selectedDate: Date | undefined;
  selectedTime: string;
}

export const validateBookingForm = (formData: FormData): boolean => {
  const { yourName, postcode, phone, email, jobDetails } = formData;
  
  // Create booking data object for validation
  const bookingData: BookingFormData = {
    yourName,
    postcode,
    phone,
    email,
    jobDetails,
    notes: formData.notes
  };
  
  // Use comprehensive validation and sanitization
  const { isValid, errors } = validateAndSanitizeBookingData(bookingData);
  
  if (!isValid) {
    toast.error("Validation Failed", {
      description: errors.join(', '),
      duration: 4000
    });
    console.log("Validation failed:", errors);
    return false;
  }

  // Additional validation for date/time
  if (!formData.selectedDate) {
    toast.error("Date Required", {
      description: "Please select a service date",
      duration: 4000
    });
    return false;
  }

  if (!formData.selectedTime) {
    toast.error("Time Required", {
      description: "Please select a service time",
      duration: 4000
    });
    return false;
  }

  return true;
};
