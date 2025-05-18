
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface BookingFormProps {
  onSubmit: (formData: {
    yourName: string;
    postcode: string;
    phone: string;
    email: string;
    notes: string;
    vehicleReg: string; // Added vehicleReg field
  }) => void;
}

const BookingForm = ({ onSubmit }: BookingFormProps) => {
  const [yourName, setYourName] = useState("");
  const [postcode, setPostcode] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [vehicleReg, setVehicleReg] = useState(""); // Added state for vehicleReg

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!yourName || !postcode || !phone || !email) {
      toast.error("Oops! Check Again");
      return;
    }
    
    onSubmit({
      yourName,
      postcode,
      phone,
      email,
      notes,
      vehicleReg, // Added vehicleReg to submission
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="yourName" className="text-white">Your Name</Label>
          <Input 
            id="yourName" 
            placeholder="Enter your name"
            value={yourName}
            onChange={(e) => setYourName(e.target.value)}
            className="bg-gray-800 border-gray-700 text-white"
            required
          />
        </div>
        
        <div>
          <Label htmlFor="postcode" className="text-white">Post Code</Label>
          <Input 
            id="postcode" 
            placeholder="What's the Post Code"
            value={postcode}
            onChange={(e) => setPostcode(e.target.value)}
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
          <Label htmlFor="email" className="text-white">Email</Label>
          <Input 
            id="email" 
            placeholder="Enter your Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-gray-800 border-gray-700 text-white"
            required
          />
        </div>
        
        {/* Added Vehicle Registration field */}
        <div>
          <Label htmlFor="vehicleReg" className="text-white">Vehicle Reg/Job request</Label>
          <Input 
            id="vehicleReg" 
            placeholder="Car registration or boat/vehicle details"
            value={vehicleReg}
            onChange={(e) => setVehicleReg(e.target.value)}
            className="bg-gray-800 border-gray-700 text-white"
          />
        </div>
        
        <div>
          <Label htmlFor="notes" className="text-white">Any Notes</Label>
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
        Request Booking
      </Button>
    </form>
  );
};

export default BookingForm;
