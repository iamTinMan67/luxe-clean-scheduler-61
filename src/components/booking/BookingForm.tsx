
import { useBookingForm } from "@/hooks/useBookingForm";
import PersonalInfoFields from "./PersonalInfoFields";
import LocationVehicleFields from "./LocationVehicleFields";
import NotesField from "./NotesField";
import SubmitButton from "./SubmitButton";
import { useEffect, useState } from "react";

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
  const [packageType, setPackageType] = useState("medium");
  const [additionalServices, setAdditionalServices] = useState<any[]>([]);
  
  // Load package data from localStorage when component mounts
  useEffect(() => {
    const savedVehicleDetails = localStorage.getItem('vehicleDetails');
    if (savedVehicleDetails) {
      try {
        const vehicles = JSON.parse(savedVehicleDetails);
        if (vehicles && vehicles.length > 0) {
          setPackageType(vehicles[0].package || "medium");
          setAdditionalServices(vehicles[0].additionalServices || []);
        }
      } catch (error) {
        console.error('Error parsing vehicle details:', error);
      }
    }
  }, []);
  
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
        {/* Package summary display */}
        <div className="p-4 rounded-md bg-gold/10 border border-gold/30">
          <h3 className="font-medium text-gold mb-2">Your Selected Package</h3>
          <p className="text-white">{packageType.charAt(0).toUpperCase() + packageType.slice(1)} Package</p>
          {additionalServices.length > 0 && (
            <div className="mt-2">
              <p className="text-sm text-gold mb-1">Additional Services:</p>
              <ul className="text-sm text-white">
                {additionalServices.map((service, index) => (
                  <li key={index} className="flex items-center gap-1">
                    <span>•</span> {service.name}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        
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
