
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { DatePicker } from "@/components/ui/date-picker";
import BookingForm from "@/components/booking/BookingForm";
import DateTimeSelector from "@/components/booking/DateTimeSelector";
import ConditionSlider from "@/components/ui/ConditionSlider";
import { Vehicle } from "@/lib/types";

const Booking = () => {
  const navigate = useNavigate();
  const datePickerRef = useRef<HTMLDivElement>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState("");
  const [vehicleCondition, setVehicleCondition] = useState<number>(5);
  const [jobDetails, setJobDetails] = useState("");
  
  const timeOptions = [
    "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"
  ];

  // Add useEffect to scroll to date picker when component mounts
  useEffect(() => {
    if (datePickerRef.current) {
      datePickerRef.current.scrollIntoView({ 
        behavior: 'auto', // Using 'auto' for initial load to avoid animation issues
        block: 'start'
      });
    }
  }, []);

  useEffect(() => {
    // Load vehicle details from localStorage if available
    const savedVehicleDetails = localStorage.getItem('vehicleDetails');
    if (savedVehicleDetails) {
      try {
        const vehicles = JSON.parse(savedVehicleDetails);
        if (vehicles && vehicles.length > 0) {
          // Set vehicle condition from the first vehicle
          if (vehicles[0].condition) {
            setVehicleCondition(vehicles[0].condition);
          }
        }
      } catch (error) {
        console.error('Error parsing vehicle details:', error);
      }
    }
  }, []);

  const handleDateFocus = () => {
    // Scroll to the date picker when it receives focus
    if (datePickerRef.current) {
      datePickerRef.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };
  
  const handleFormSubmit = (formData: any) => {
    // Get saved vehicle details including package type and client type
    const savedVehicleDetails = localStorage.getItem('vehicleDetails');
    let packageType = "medium"; // Default to medium package
    let vehicleType = "car";
    let clientType = "private";
    let additionalServicesInfo: any[] = [];
    let packageDetails = null;
    
    if (savedVehicleDetails) {
      try {
        const vehicles: Vehicle[] = JSON.parse(savedVehicleDetails);
        if (vehicles && vehicles.length > 0) {
          // Get details from the first vehicle
          packageType = vehicles[0].package || "medium";
          vehicleType = vehicles[0].type || "car";
          clientType = vehicles[0].clientType || "private";
          additionalServicesInfo = vehicles[0].additionalServices || [];
        }
      } catch (error) {
        console.error('Error parsing vehicle details:', error);
      }
    }
    
    // Get package details from packageOptions
    try {
      const packageOptionsData = localStorage.getItem('packageOptions');
      if (packageOptionsData) {
        const packageOptions = JSON.parse(packageOptionsData);
        packageDetails = packageOptions.find((pkg: any) => pkg.type === packageType);
      }
    } catch (error) {
      console.error('Error parsing package options:', error);
    }
    
    const bookingData = {
      ...formData,
      date: selectedDate,
      time: selectedTime,
      vehicleCondition: vehicleCondition,
      jobDetails: formData.jobDetails
    };
    
    // Retrieve existing bookings from localStorage
    const existingBookings = localStorage.getItem('pendingBookings');
    const bookings = existingBookings ? JSON.parse(existingBookings) : [];
    
    // Generate a unique ID for the new booking
    const bookingId = Math.random().toString(36).substring(2, 15);
    
    // Calculate total price
    let totalPrice = 0;
    if (packageDetails) {
      totalPrice = packageDetails.basePrice;
      // Add cost of additional services
      if (additionalServicesInfo && additionalServicesInfo.length > 0) {
        additionalServicesInfo.forEach((service) => {
          totalPrice += service.price || 0;
        });
      }
    }
    
    // Add the new booking to the array
    bookings.push({
      id: bookingId,
      ...bookingData,
      status: "pending",
      customer: `${formData.yourName}`,
      vehicle: formData.jobDetails || vehicleType,
      clientType: clientType,
      packageType: packageType,
      location: formData.postcode,
      contact: formData.phone,
      email: formData.email,
      notes: formData.notes,
      condition: vehicleCondition,
      additionalServices: additionalServicesInfo,
      totalPrice: totalPrice
    });
    
    // Save the updated bookings array back to localStorage
    localStorage.setItem('pendingBookings', JSON.stringify(bookings));
    
    // Create a more detailed notification
    let packageInfo = packageType.charAt(0).toUpperCase() + packageType.slice(1);
    let additionalInfo = additionalServicesInfo.length > 0 
      ? `with ${additionalServicesInfo.length} additional services` 
      : '';
    
    toast.success("Booking request submitted!", {
      description: `${packageInfo} Package ${additionalInfo} for ${formData.yourName}. Total: £${totalPrice}`,
    });
    
    // Change redirection to gallery page instead
    setTimeout(() => {
      navigate("/gallery");
    }, 2000);
  };
  
  return (
    <div className="min-h-screen bg-black text-white py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto mb-12 text-center">
          <h1 className="text-4xl font-bold mb-4">Book Your Service</h1>
          <p className="text-gray-300">
            Please use our simplified booking form. We will confirm
            availability to your request.
          </p>
        </div>
        
        <div className="max-w-3xl mx-auto bg-gray-900/50 backdrop-blur-sm rounded-lg p-8 border border-gray-800">
          <div className="space-y-6">
            {/* Calendar and Time Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6" ref={datePickerRef} id="date-picker-section">
              <div className="md:col-span-2">
                <Label className="text-white mb-2 block">Select Date & Available Time</Label>
                <DateTimeSelector 
                  date={selectedDate}
                  time={selectedTime}
                  onDateChange={setSelectedDate}
                  onTimeChange={setSelectedTime}
                />
              </div>
            </div>
            
            {/* Vehicle Condition Slider */}
            <ConditionSlider 
              value={vehicleCondition} 
              onChange={setVehicleCondition} 
            />
            
            <BookingForm onSubmit={handleFormSubmit} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Booking;
