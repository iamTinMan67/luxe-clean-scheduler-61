
import { validateBookingForm } from "@/utils/bookingValidation";
import { transformFormDataToBooking } from "@/utils/bookingDataTransformer";
import { saveBookingToStorage, clearClientTypeFromStorage } from "@/utils/bookingStorage";
import { showBookingSuccessNotification, showBookingErrorNotification } from "@/utils/bookingNotifications";

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

export const useSimpleBookingSubmission = () => {
  const submitBooking = async (formData: FormData, resetForm: () => void) => {
    console.log("Simple booking submission data:", formData);
    
    // Validate form data
    if (!validateBookingForm(formData)) {
      return;
    }

    try {
      // Transform form data to booking
      const newBooking = transformFormDataToBooking(formData);

      // Save booking to storage
      saveBookingToStorage(newBooking);

      // Clear the saved client type
      clearClientTypeFromStorage();

      // Show success notification
      showBookingSuccessNotification();

      // Reset form
      resetForm();

    } catch (error) {
      console.error("Error submitting booking:", error);
      showBookingErrorNotification();
    }
  };

  return { submitBooking };
};
