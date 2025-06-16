
import React from 'react';
import { MapPin, Mail, Phone, User } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp } from 'lucide-react';

interface BookingContactDetailsProps {
  customer: string;
  location: string;
  email?: string;
  contact?: string;
  clientType?: "private" | "corporate";
}

const BookingContactDetails: React.FC<BookingContactDetailsProps> = ({
  customer,
  location,
  email,
  contact,
  clientType
}) => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <Collapsible 
      open={isOpen} 
      onOpenChange={setIsOpen}
      className="mt-4"
    >
      <CollapsibleTrigger className="flex w-full items-center justify-between py-2 text-sm text-gray-400 hover:text-white border-t border-gray-700 pt-3">
        <span>Contact Details</span>
        {isOpen ? (
          <ChevronUp className="h-4 w-4" />
        ) : (
          <ChevronDown className="h-4 w-4" />
        )}
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-2 pt-2">
        {/* Customer Name - Now prominently displayed */}
        <div className="flex items-center text-gray-300">
          <User className="w-4 h-4 mr-2 text-gold" />
          <span className="font-medium text-white">{customer}</span>
        </div>
        
        {/* Location - Post Code */}
        <div className="flex items-center text-gray-300">
          <MapPin className="w-4 h-4 mr-2 text-gold" />
          <span>{location}</span>
        </div>
        
        {/* Email */}
        {email && (
          <div className="flex items-center text-gray-300">
            <Mail className="w-4 h-4 mr-2 text-gold" />
            <span>{email}</span>
          </div>
        )}
        
        {/* Phone */}
        {contact && (
          <div className="flex items-center text-gray-300">
            <Phone className="w-4 h-4 mr-2 text-gold" />
            <span>{contact}</span>
          </div>
        )}
      </CollapsibleContent>
    </Collapsible>
  );
};

export default BookingContactDetails;
