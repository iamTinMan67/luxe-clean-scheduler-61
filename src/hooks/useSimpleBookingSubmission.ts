
import { useState } from "react";
import { validateBookingForm } from "@/utils/bookingValidation";
import { transformFormDataToBooking } from "@/utils/bookingDataTransformer";
import { saveBookingToStorage, clearClientTypeFromStorage } from "@/utils/bookingStorage";
import { showBookingSuccessNotification, showBookingErrorNotification } from "@/utils/bookingNotifications";
import { syncBookingToSupabase } from "@/services/bookingSyncService";

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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitBooking = async (formData: FormData, resetForm: () => void) => {
    if (isSubmitting) {
      console.log("Submission already in progress, ignoring duplicate request");
      return;
    }

    console.log("=== Simple booking submission started ===");
    console.log("Simple booking submission data:", formData);
    
    setIsSubmitting(true);

    try {
      // Validate form data
      if (!validateBookingForm(formData)) {
        console.log("Form validation failed");
        return;
      }

      // Transform form data to booking (this now uses the new ID system)
      const newBooking = transformFormDataToBooking(formData);
      console.log("Transformed booking with new ID:", newBooking);

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
        throw new Error("Booking could not be verified in storage");
      }

      // Sync booking to Supabase
      console.log("Syncing booking to Supabase...");
      const syncSuccess = await syncBookingToSupabase(newBooking);
      
      if (syncSuccess) {
        console.log("✅ Booking successfully synced to Supabase");
      } else {
        console.warn("⚠️ Failed to sync booking to Supabase, but saved locally");
        // Don't throw error - booking is still saved locally
      }

      // Clear the saved client type
      clearClientTypeFromStorage();

      // Show success notification
      showBookingSuccessNotification();

      // Wait a moment before resetting form to allow user to see the success message
      setTimeout(() => {
        resetForm();
        console.log("Form reset after successful submission");
      }, 1500);
      
      console.log("=== Simple booking submission completed successfully ===");

    } catch (error) {
      console.error("Error submitting booking:", error);
      showBookingErrorNotification();
    } finally {
      setIsSubmitting(false);
    }
  };

  return { submitBooking, isSubmitting };
};
