
import { useSimpleBookingFormState } from "./useSimpleBookingFormState";
import { useSimpleBookingSubmission } from "./useSimpleBookingSubmission";

export const useSimpleBookingForm = () => {
  const {
    yourName,
    setYourName,
    postcode,
    setPostcode,
    phone,
    setPhone,
    email,
    setEmail,
    notes,
    setNotes,
    jobDetails,
    setJobDetails,
    selectedDate,
    setSelectedDate,
    selectedTime,
    setSelectedTime,
    resetForm,
  } = useSimpleBookingFormState();

  const { submitBooking, isSubmitting } = useSimpleBookingSubmission();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submission initiated");
    
    if (isSubmitting) {
      console.log("Already submitting, ignoring duplicate submission");
      return;
    }
    
    const formData = {
      yourName,
      postcode,
      phone,
      email,
      notes,
      jobDetails,
      selectedDate,
      selectedTime,
    };

    console.log("Calling submitBooking with data:", formData);
    await submitBooking(formData, resetForm);
  };

  return {
    yourName,
    setYourName,
    postcode,
    setPostcode,
    phone,
    setPhone,
    email,
    setEmail,
    notes,
    setNotes,
    jobDetails,
    setJobDetails,
    selectedDate,
    setSelectedDate,
    selectedTime,
    setSelectedTime,
    handleSubmit,
    isSubmitting,
  };
};
