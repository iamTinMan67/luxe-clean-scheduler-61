
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface BookingFormProps {
  onSubmit: (formData: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    notes: string;
    contactPreference: string;
  }) => void;
}

const BookingForm = ({ onSubmit }: BookingFormProps) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [contactPreference, setContactPreference] = useState("email");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!firstName || !lastName || !email || !phone) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    onSubmit({
      firstName,
      lastName,
      email,
      phone,
      notes,
      contactPreference
    });
  };

  return (
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
  );
};

export default BookingForm;
