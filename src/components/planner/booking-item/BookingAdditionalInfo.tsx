
import React from 'react';
import { Car } from 'lucide-react';
import { AdditionalService } from '@/lib/types';

interface BookingAdditionalInfoProps {
  additionalServices: AdditionalService[];
  secondVehicle?: string;
  secondVehicleReg?: string;
}

const BookingAdditionalInfo: React.FC<BookingAdditionalInfoProps> = ({
  additionalServices,
  secondVehicle,
  secondVehicleReg
}) => {
  // Only render if there's data to show
  if (additionalServices.length === 0 && !secondVehicle) {
    return null;
  }
  
  return (
    <>
      {/* Show additional services if any */}
      {additionalServices.length > 0 && (
        <div className="mt-2 pt-2 border-t border-gray-800">
          <h4 className="text-sm font-medium text-gold mb-1">Additional Services:</h4>
          <ul className="text-sm text-gray-300">
            {additionalServices.map((service, index) => (
              <li key={index} className="flex items-center">
                <span className="mr-1">•</span> {service?.name} 
                {service?.price ? ` (£${service.price})` : ''} 
                {service?.duration ? ` (${service.duration} mins)` : ''}
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {/* Display second vehicle details if available */}
      {secondVehicle && (
        <div className="mt-2 pt-2 border-t border-gray-800">
          <h4 className="text-sm font-medium text-gold mb-1">Second Vehicle:</h4>
          <div className="text-sm text-gray-300 flex items-center">
            <Car className="w-3 h-3 mr-1 text-gold" />
            <span>{secondVehicle}</span>
            {secondVehicleReg && 
              <span className="ml-1 text-xs text-gray-400">(Reg: {secondVehicleReg})</span>
            }
          </div>
        </div>
      )}
    </>
  );
};

export default BookingAdditionalInfo;
