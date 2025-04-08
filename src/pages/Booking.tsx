
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { DatePicker } from "@/components/ui/date-picker";
import BookingForm from "@/components/booking/BookingForm";
import DateTimeSelector from "@/components/booking/DateTimeSelector";
import ConditionSlider from "@/components/ui/ConditionSlider";

const Booking = () => {
  const navigate = useNavigate();
  const datePickerRef = useRef<HTMLDivElement>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState("");
  const [vehicleCondition, setVehicleCondition] = useState<number>(5);
  const [vehicleReg, setVehicleReg] = useState("");
  
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
    
    const bookingData = {
      ...formData,
      date: selectedDate,
      time: selectedTime,
      vehicleCondition: vehicleCondition,
      vehicleReg: vehicleReg
    };
    
    // Retrieve existing bookings from localStorage
    const existingBookings = localStorage.getItem('pendingBookings');
    const bookings = existingBookings ? JSON.parse(existingBookings) : [];
    
    // Generate a unique ID for the new booking
    const bookingId = Math.random().toString(36).substring(2, 15);
    
    // Add the new booking to the array
    bookings.push({
      id: bookingId,
      ...bookingData,
      status: "pending",
      customer: `${formData.yourName}`,
      vehicle: vehicleReg || "TBC",
      packageType: "TBC",
      location: formData.postcode || "TBC",
      contact: formData.phone,
      email: formData.email,
      notes: formData.notes,
      condition: vehicleCondition
    });
    
    // Save the updated bookings array back to localStorage
    localStorage.setItem('pendingBookings', JSON.stringify(bookings));
    
    toast.success("Booking request submitted!", {
      description: "We'll check our planner and get back to you soon.",
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
          <h1 className="text-4xl font-bold mb-4">Book Your Valeting Service</h1>
          <p className="text-gray-300">
            Please use our simple booking form. We will confirm
            availability and get back to you as soon as possible.
          </p>
        </div>
        
        <div className="max-w-3xl mx-auto bg-gray-900/50 backdrop-blur-sm rounded-lg p-8 border border-gray-800">
          <div className="space-y-6">
            {/* Calendar and Time Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6" ref={datePickerRef} id="date-picker-section">
              <div>
                <Label className="text-white">Select Date</Label>
                <DatePicker 
                  date={selectedDate} 
                  onDateChange={setSelectedDate} 
                  onFocus={handleDateFocus}
                />
              </div>
              
              <div>
                <Label className="text-white">Pick a time</Label>
                <select
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  className="w-full bg-gray-800 border-gray-700 rounded px-4 py-2 text-white"
                >
                  <option value="" disabled>Pick a time</option>
                  {timeOptions.map((time) => (
                    <option key={time} value={time}>{time}</option>
                  ))}
                </select>
              </div>
            </div>
            
            {/* Vehicle Registration */}
            <div>
              <Label htmlFor="vehicleReg" className="text-white">Vehicle Registration</Label>
              <input
                type="text"
                id="vehicleReg"
                placeholder="Enter vehicle registration"
                value={vehicleReg}
                onChange={(e) => setVehicleReg(e.target.value)}
                className="w-full bg-gray-800 border-gray-700 rounded px-4 py-2 text-white"
              />
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
