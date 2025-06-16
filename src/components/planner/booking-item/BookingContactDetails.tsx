
import React from 'react';
import { MapPin, Mail, Phone, Building, Home } from 'lucide-react';
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

  // Get client category styling
  const getClientCategoryStyling = (type?: string) => {
    switch (type) {
      case "private":
        return "text-blue-400 border-blue-400";
      case "corporate":
        return "text-green-400 border-green-400";
      default:
        return "text-gray-400 border-gray-400";
    }
  };

  const getClientIcon = (type?: string) => {
    switch (type) {
      case "private":
        return <Home className="w-4 h-4 mr-1" />;
      case "corporate":
        return <Building className="w-4 h-4 mr-1" />;
      default:
        return null;
    }
  };

  const getClientLabel = (type?: string) => {
    switch (type) {
      case "private":
        return "Private";
      case "corporate":
        return "Commercial";
      default:
        return null;
    }
  };

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
        {/* Client Category */}
        {clientType && (
          <div className="flex items-center">
            <div className={`flex items-center px-2 py-1 rounded-full border text-xs ${getClientCategoryStyling(clientType)}`}>
              {getClientIcon(clientType)}
              <span>{getClientLabel(clientType)}</span>
            </div>
          </div>
        )}
        
        {/* Location */}
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
