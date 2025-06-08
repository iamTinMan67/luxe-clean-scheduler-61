
import React from 'react';
import { MapPin, User, Mail, Phone, Car, Building, Home } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp } from 'lucide-react';

interface BookingContactDetailsProps {
  location: string;
  notes?: string;
  email?: string;
  contact?: string;
  jobDetails?: string;
  condition?: number;
  clientType?: "private" | "corporate";
  vehicleType?: string;
}

const BookingContactDetails: React.FC<BookingContactDetailsProps> = ({
  location,
  notes,
  email,
  contact,
  jobDetails,
  condition,
  clientType,
  vehicleType
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
        return <User className="w-4 h-4 mr-1" />;
    }
  };

  const getClientLabel = (type?: string) => {
    switch (type) {
      case "private":
        return "Private";
      case "corporate":
        return "Commercial";
      default:
        return "Unknown";
    }
  };

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
        {/* Client Category and Job Type */}
        {(clientType || vehicleType) && (
          <div className="flex items-center justify-between">
            {clientType && (
              <div className={`flex items-center px-2 py-1 rounded-full border text-xs ${getClientCategoryStyling(clientType)}`}>
                {getClientIcon(clientType)}
                <span>{getClientLabel(clientType)}</span>
              </div>
            )}
            {vehicleType && (
              <div className="text-gray-300 text-xs">
                Job Type: {vehicleType}
              </div>
            )}
          </div>
        )}
        
        <div className="flex items-center text-gray-300">
          <MapPin className="w-4 h-4 mr-2 text-gold" />
          <span>{location}</span>
        </div>
        
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
        
        {notes && (
          <div className="flex items-center text-gray-300">
            <User className="w-4 h-4 mr-2 text-gold" />
            <span>{notes}</span>
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
