
import React from 'react';
import { useSimpleBookingForm } from '@/hooks/useSimpleBookingForm';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import ClientTypeDisplay from './ClientTypeDisplay';
import ContactDetailsForm from './ContactDetailsForm';
import ServiceDetailsForm from './ServiceDetailsForm';
import ScheduleForm from './ScheduleForm';

const SimpleBookingForm = () => {
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
    handleSubmit,
    isSubmitting,
  } = useSimpleBookingForm();

  const onFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted - calling handleSubmit");
    handleSubmit(e);
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <form onSubmit={onFormSubmit} className="space-y-6" id="simple-booking-form">
        {/* Client Type Display */}
        <ClientTypeDisplay />

        {/* Contact Details */}
        <ContactDetailsForm
          yourName={yourName}
          setYourName={setYourName}
          phone={phone}
          setPhone={setPhone}
          email={email}
          setEmail={setEmail}
          postcode={postcode}
          setPostcode={setPostcode}
        />

        {/* Service Details */}
        <ServiceDetailsForm
          jobDetails={jobDetails}
          setJobDetails={setJobDetails}
          notes={notes}
          setNotes={setNotes}
        />

        {/* Schedule */}
        <ScheduleForm
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          selectedTime={selectedTime}
          setSelectedTime={setSelectedTime}
        />

        {/* Submit Button */}
        <div className="pt-4">
          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full bg-gold text-black hover:bg-gold/90 font-bold py-3 text-lg transition-all hover:shadow-lg hover:shadow-gold/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Submitting Request...
              </div>
            ) : (
              "Request Booking"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default SimpleBookingForm;
