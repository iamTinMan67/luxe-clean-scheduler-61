
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const Booking = () => {
  const navigate = useNavigate();
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [time, setTime] = useState<string>("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [contactPreference, setContactPreference] = useState("email");

  // Retrieve the vehicle details and total price from localStorage
  const vehicleDetails = localStorage.getItem('vehicleDetails')
    ? JSON.parse(localStorage.getItem('vehicleDetails') || '[]')
    : [];
  const totalPrice = localStorage.getItem('totalPrice') || "0";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!date) {
      toast.error("Please select a date for your booking");
      return;
    }
    
    if (!time) {
      toast.error("Please select a time for your booking");
      return;
    }
    
    if (!firstName || !lastName || !email || !phone) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    // In a real app, you would send this data to your backend
    toast.success("Booking submitted successfully!", {
      description: `We'll confirm your appointment soon.`,
    });
    
    // Navigate to the progress page
    setTimeout(() => {
      navigate("/progress");
    }, 2000);
  };

  const timeSlots = [
    "08:00", "09:00", "10:00", "11:00", "12:00",
    "13:00", "14:00", "15:00", "16:00", "17:00"
  ];

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
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="firstName" className="text-white">First Name</Label>
                    <Input 
                      id="firstName" 
                      placeholder="Enter your first name"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="bg-gray-800 border-gray-700 text-white"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="lastName" className="text-white">Last Name</Label>
                    <Input 
                      id="lastName" 
                      placeholder="Enter your last name"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="bg-gray-800 border-gray-700 text-white"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="email" className="text-white">Email</Label>
                    <Input 
                      id="email" 
                      type="email"
                      placeholder="Enter your email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="bg-gray-800 border-gray-700 text-white"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="phone" className="text-white">Phone Number</Label>
                    <Input 
                      id="phone" 
                      placeholder="Enter your phone number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="bg-gray-800 border-gray-700 text-white"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label className="text-white">Preferred Contact Method</Label>
                    <RadioGroup 
                      value={contactPreference} 
                      onValueChange={setContactPreference}
                      className="flex gap-4 mt-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="email" id="email-option" />
                        <Label htmlFor="email-option" className="text-white">Email</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="phone" id="phone-option" />
                        <Label htmlFor="phone-option" className="text-white">Phone</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="sms" id="sms-option" />
                        <Label htmlFor="sms-option" className="text-white">SMS</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  
                  <div>
                    <Label htmlFor="notes" className="text-white">Additional Notes</Label>
                    <Textarea 
                      id="notes" 
                      placeholder="Any special instructions or requirements?"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="bg-gray-800 border-gray-700 text-white h-24"
                    />
                  </div>
                </div>
                
                <Button type="submit" className="w-full gold-gradient text-black hover:shadow-xl hover:shadow-gold/20 transition-all">
                  Confirm Booking
                </Button>
              </form>
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
                
                <div className="mb-6">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    className="bg-gray-900 border border-gray-800 rounded-md p-4"
                    classNames={{
                      day_selected: "bg-gold text-black",
                      day_today: "bg-gray-800 text-white",
                      day: "text-white hover:bg-gray-800"
                    }}
                    disabled={(date) => {
                      // Disable past dates and Sundays
                      const now = new Date();
                      now.setHours(0, 0, 0, 0);
                      return date < now || date.getDay() === 0;
                    }}
                  />
                </div>
                
                {date && (
                  <div>
                    <h3 className="text-lg font-medium text-white mb-3">
                      Available Times for {format(date, "EEEE, MMMM d, yyyy")}
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {timeSlots.map((slot) => (
                        <button
                          key={slot}
                          type="button"
                          className={`py-2 px-3 rounded-md text-sm transition-colors ${
                            time === slot
                              ? "gold-gradient text-black"
                              : "bg-gray-800 text-white hover:bg-gray-700"
                          }`}
                          onClick={() => setTime(slot)}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
              
              {/* Order Summary */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="bg-gray-900/50 backdrop-blur-sm rounded-lg p-6 border border-gray-800"
              >
                <h2 className="text-2xl font-bold mb-6 text-white">Order Summary</h2>
                
                {vehicleDetails.length > 0 ? (
                  <div className="space-y-4 mb-6">
                    {vehicleDetails.map((vehicle: any, index: number) => (
                      <div key={index} className="flex justify-between pb-2 border-b border-gray-800">
                        <div className="text-gray-300">
                          <div className="font-medium text-white">Vehicle {index + 1}</div>
                          <div className="text-sm capitalize">{vehicle.type} ({vehicle.size})</div>
                          <div className="text-sm">{vehicle.package.toUpperCase()} package</div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400 mb-4">No vehicle details found. Please go back to services.</p>
                )}
                
                <div className="flex justify-between items-center text-xl font-bold">
                  <span className="text-white">Total</span>
                  <span className="text-gold">£{totalPrice}</span>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Booking;
