
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
      description: "Please fill in all required fields",
      duration: 4000
    });
    console.log("Validation failed - missing required fields");
    return false;
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    toast.error("Invalid Email", {
      description: "Please enter a valid email address",
      duration: 4000
    });
    console.log("Validation failed - invalid email format");
    return false;
  }

  return true;
};
