
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
    console.log("=== Simple booking submission started ===");
    console.log("Simple booking submission data:", formData);
    
    // Validate form data
    if (!validateBookingForm(formData)) {
      console.log("Form validation failed");
      return;
    }

    try {
      // Transform form data to booking
      const newBooking = transformFormDataToBooking(formData);
      console.log("Transformed booking:", newBooking);

      // Save booking to storage (this will now save to 'pendingBookings' key)
      saveBookingToStorage(newBooking);

      // Verify the booking was saved correctly
      const savedBookings = JSON.parse(localStorage.getItem('pendingBookings') || '[]');
      console.log("Verification - pendingBookings after save:", savedBookings.length);
      
      const justSavedBooking = savedBookings.find((b: any) => b.id === newBooking.id);
      if (justSavedBooking) {
        console.log("✅ Booking successfully saved and verified:", justSavedBooking);
      } else {
        console.error("❌ Booking not found in pendingBookings after save");
      }

      // Clear the saved client type
      clearClientTypeFromStorage();

      // Show success notification
      showBookingSuccessNotification();

      // Reset form
      resetForm();
      
      console.log("=== Simple booking submission completed successfully ===");

    } catch (error) {
      console.error("Error submitting booking:", error);
      showBookingErrorNotification();
    }
  };

  return { submitBooking };
};
