
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface PersonalInfoFieldsProps {
  yourName: string;
  setYourName: (value: string) => void;
  phone: string;
  setPhone: (value: string) => void;
  email: string;
  setEmail: (value: string) => void;
}

const PersonalInfoFields = ({ 
  yourName, 
  setYourName, 
  phone, 
  setPhone, 
  email, 
  setEmail 
}: PersonalInfoFieldsProps) => {
  return (
    <>
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
    </>
  );
};

export default PersonalInfoFields;
