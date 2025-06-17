
import React from 'react';
import { useSimpleBookingForm } from '@/hooks/useSimpleBookingForm';
import ContactDetailsSection from '@/components/booking/ContactDetailsSection';
import JobDetailsSection from '@/components/booking/JobDetailsSection';
import SubmitButton from '@/components/booking/SubmitButton';

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
    handleSubmit,
  } = useSimpleBookingForm();

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <ContactDetailsSection
        yourName={yourName}
        setYourName={setYourName}
        phone={phone}
        setPhone={setPhone}
        email={email}
        setEmail={setEmail}
        postcode={postcode}
        setPostcode={setPostcode}
      />
      
      <JobDetailsSection
        jobDetails={jobDetails}
        setJobDetails={setJobDetails}
        notes={notes}
        setNotes={setNotes}
      />
      
      <SubmitButton />
    </form>
  );
};

export default SimpleBookingForm;
