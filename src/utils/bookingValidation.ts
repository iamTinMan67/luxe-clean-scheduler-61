
import { toast } from "sonner";

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
  
  if (!yourName || !postcode || !phone || !email || !jobDetails) {
    toast.error("Oops! Check Again", {
      description: "Please fill in all required fields"
    });
    console.log("Validation failed - missing required fields");
    return false;
  }

  return true;
};
