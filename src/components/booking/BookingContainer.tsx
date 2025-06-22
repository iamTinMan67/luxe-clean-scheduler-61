
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import BookingForm from "./BookingForm";
import DateTimeSection from "./DateTimeSection";
import VehicleConditionSection from "./VehicleConditionSection";
import { Vehicle } from "@/lib/types";
import { generateBookingId } from "@/utils/bookingIdGenerator";

const BookingContainer = () => {
  const navigate = useNavigate();
  const datePickerRef = useRef<HTMLDivElement>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState("");
  const [vehicleCondition, setVehicleCondition] = useState<number>(5);

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
    
    // Generate a unique ID using the new system
    const bookingId = generateBookingId(clientType as "private" | "corporate", vehicleType);
    
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
      id: bookingId, // Use the new ID format
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
      totalPrice: totalPrice,
      jobType: vehicleType
    });
    
    // Save the updated bookings array back to localStorage
    localStorage.setItem('pendingBookings', JSON.stringify(bookings));
    
    // Create a more detailed notification
    let packageInfo = packageType.charAt(0).toUpperCase() + packageType.slice(1);
    let additionalInfo = additionalServicesInfo.length > 0 
      ? `with ${additionalServicesInfo.length} additional services` 
      : '';
    
    toast.success("Booking request submitted!", {
      description: `${packageInfo} Package ${additionalInfo} for ${formData.yourName}. Booking ID: ${bookingId}. Total: £${totalPrice}`,
    });
    
    // Change redirection to gallery page instead
    setTimeout(() => {
      navigate("/gallery");
    }, 2000);
  };

  return (
    <div className="max-w-3xl mx-auto bg-gray-900/50 backdrop-blur-sm rounded-lg p-8 border border-gray-800">
      <div className="space-y-6">
        {/* Calendar and Time Selection */}
        <div ref={datePickerRef} id="date-picker-section">
          <DateTimeSection 
            selectedDate={selectedDate}
            selectedTime={selectedTime}
            onDateChange={setSelectedDate}
            onTimeChange={setSelectedTime}
          />
        </div>
        
        {/* Vehicle Condition Slider */}
        <VehicleConditionSection 
          vehicleCondition={vehicleCondition}
          setVehicleCondition={setVehicleCondition}
        />
        
        <BookingForm onSubmit={handleFormSubmit} />
      </div>
    </div>
  );
};

export default BookingContainer;
