
import { useBookingForm } from "@/hooks/useBookingForm";
import PersonalInfoFields from "./PersonalInfoFields";
import LocationVehicleFields from "./LocationVehicleFields";
import NotesField from "./NotesField";
import SubmitButton from "./SubmitButton";

interface BookingFormProps {
  onSubmit: (formData: {
    yourName: string;
    postcode: string;
    phone: string;
    email: string;
    notes: string;
    jobDetails: string;
  }) => void;
}

const BookingForm = ({ onSubmit }: BookingFormProps) => {
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
  } = useBookingForm({ onSubmit });

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <PersonalInfoFields 
          yourName={yourName}
          setYourName={setYourName}
          phone={phone}
          setPhone={setPhone}
          email={email}
          setEmail={setEmail}
        />
        
        <LocationVehicleFields 
          postcode={postcode}
          setPostcode={setPostcode}
          jobDetails={jobDetails}
          setJobDetails={setJobDetails}
          notes={notes}
          setNotes={setNotes}
        />
        
        <NotesField 
          notes={notes}
          setNotes={setNotes}
        />
      </div>
      
      <SubmitButton />
    </form>
  );
};

export default BookingForm;
