
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "sonner";
import BookingForm from "@/components/booking/BookingForm";
import DateTimeSelector from "@/components/booking/DateTimeSelector";
import OrderSummary from "@/components/booking/OrderSummary";

const Booking = () => {
  const navigate = useNavigate();
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [time, setTime] = useState<string>("");

  // Enhanced useEffect to scroll to the top when the component mounts
  useEffect(() => {
    // Using setTimeout to ensure this happens after the render
    setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: 'auto'
      });
    }, 0);
  }, []);

  // Retrieve the vehicle details and total price from localStorage
  const vehicleDetails = localStorage.getItem('vehicleDetails')
    ? JSON.parse(localStorage.getItem('vehicleDetails') || '[]')
    : [];
  const totalPrice = localStorage.getItem('totalPrice') || "0";

  const handleFormSubmit = (formData: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    notes: string;
    contactPreference: string;
  }) => {
    if (!date) {
      toast.error("Please select a date for your booking");
      return;
    }
    
    if (!time) {
      toast.error("Please select a time for your booking");
      return;
    }
    
    // Create a booking object with all the relevant details
    const bookingData = {
      id: `BK-${Math.floor(Math.random() * 90000) + 10000}`,
      customer: `${formData.firstName} ${formData.lastName}`,
      vehicle: vehicleDetails.length > 0 ? `${vehicleDetails[0].type}` : "Not specified",
      packageType: vehicleDetails.length > 0 ? vehicleDetails[0].package : "Basic",
      date: date,
      time: time,
      location: "Customer address",
      contact: formData.phone,
      email: formData.email,
      notes: formData.notes,
      status: "pending",
      condition: vehicleDetails.length > 0 ? vehicleDetails[0].condition : 5,
      createdAt: new Date().toISOString()
    };
    
    // Save booking to localStorage
    const existingBookings = localStorage.getItem('pendingBookings') 
      ? JSON.parse(localStorage.getItem('pendingBookings') || '[]') 
      : [];
    
    localStorage.setItem('pendingBookings', JSON.stringify([...existingBookings, bookingData]));
    
    // In a real app, you would send this data to your backend
    toast.success("Booking submitted successfully!", {
      description: `We'll confirm your appointment soon.`,
    });
    
    // Navigate to the progress page
    setTimeout(() => {
      navigate("/progress");
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-black">
      <section className="relative py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              Complete Your <span className="text-gold">Booking</span>
            </h1>
            <p className="text-xl text-gray-300">
              Select your preferred date and time, and provide your contact details.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Booking Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-gray-900/50 backdrop-blur-sm rounded-lg p-6 border border-gray-800"
            >
              <h2 className="text-2xl font-bold mb-6 text-white">Booking Details</h2>
              <BookingForm onSubmit={handleFormSubmit} />
            </motion.div>
            
            {/* Date and Time Selection */}
            <div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-gray-900/50 backdrop-blur-sm rounded-lg p-6 border border-gray-800 mb-8"
              >
                <h2 className="text-2xl font-bold mb-6 text-white">Select Date & Time</h2>
                <DateTimeSelector 
                  date={date}
                  time={time}
                  onDateChange={setDate}
                  onTimeChange={setTime}
                />
              </motion.div>
              
              {/* Order Summary */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="bg-gray-900/50 backdrop-blur-sm rounded-lg p-6 border border-gray-800"
              >
                <OrderSummary vehicleDetails={vehicleDetails} totalPrice={totalPrice} />
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Booking;
