
import React from 'react';
import { MapPin, User, Mail, Phone, Car } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp } from 'lucide-react';

interface BookingContactDetailsProps {
  location: string;
  notes?: string;
  email?: string;
  contact?: string;
  jobDetails?: string;
  condition?: number;
}

const BookingContactDetails: React.FC<BookingContactDetailsProps> = ({
  location,
  notes,
  email,
  contact,
  jobDetails,
  condition
}) => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <Collapsible 
      open={isOpen} 
      onOpenChange={setIsOpen}
      className="mt-2"
    >
      <CollapsibleTrigger className="flex w-full items-center justify-between py-2 text-sm text-gray-400 hover:text-white">
        <span>Contact Details</span>
        {isOpen ? (
          <ChevronUp className="h-4 w-4" />
        ) : (
          <ChevronDown className="h-4 w-4" />
        )}
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-2 pt-2">
        <div className="flex items-center text-gray-300">
          <MapPin className="w-4 h-4 mr-2 text-gold" />
          <span>{location}</span>
        </div>
        
        {notes && (
          <div className="flex items-center text-gray-300">
            <User className="w-4 h-4 mr-2 text-gold" />
            <span>{notes}</span>
          </div>
        )}
        
        {email && (
          <div className="flex items-center text-gray-300">
            <Mail className="w-4 h-4 mr-2 text-gold" />
            <span>{email}</span>
          </div>
        )}
        
        {contact && (
          <div className="flex items-center text-gray-300">
            <Phone className="w-4 h-4 mr-2 text-gold" />
            <span>{contact}</span>
          </div>
        )}
        
        {jobDetails && (
          <div className="flex items-center text-gray-300">
            <Car className="w-4 h-4 mr-2 text-gold" />
            <span>Details: {jobDetails}</span>
          </div>
        )}
        
        {condition !== undefined && (
          <div className="flex items-center text-gray-300">
            <span className={`text-sm ${condition < 5 ? "text-orange-400" : "text-green-400"}`}>
              Vehicle Condition: {condition}/10
            </span>
          </div>
        )}
      </CollapsibleContent>
    </Collapsible>
  );
};

export default BookingContactDetails;
