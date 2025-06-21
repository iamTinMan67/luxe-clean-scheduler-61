
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ContactDetailsFormProps {
  yourName: string;
  setYourName: (value: string) => void;
  phone: string;
  setPhone: (value: string) => void;
  email: string;
  setEmail: (value: string) => void;
  postcode: string;
  setPostcode: (value: string) => void;
}

const ContactDetailsForm = ({
  yourName,
  setYourName,
  phone,
  setPhone,
  email,
  setEmail,
  postcode,
  setPostcode,
}: ContactDetailsFormProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white">Contact Details</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="yourName" className="text-white">Full Name *</Label>
          <Input
            id="yourName"
            type="text"
            value={yourName}
            onChange={(e) => setYourName(e.target.value)}
            className="bg-gray-800 border-gray-700 text-white"
            placeholder="Enter your full name"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="phone" className="text-white">Phone Number *</Label>
          <Input
            id="phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="bg-gray-800 border-gray-700 text-white"
            placeholder="Enter your phone number"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-white">Email Address *</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-gray-800 border-gray-700 text-white"
            placeholder="Enter your email"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="postcode" className="text-white">Postcode *</Label>
          <Input
            id="postcode"
            type="text"
            value={postcode}
            onChange={(e) => setPostcode(e.target.value)}
            className="bg-gray-800 border-gray-700 text-white"
            placeholder="Enter your postcode"
            required
          />
        </div>
      </div>
    </div>
  );
};

export default ContactDetailsForm;
