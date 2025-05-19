
import React from 'react';
import { additionalServices } from "@/data/servicePackageData";

interface AdditionalServicesProps {
  serviceIds?: string[];
}

const AdditionalServices: React.FC<AdditionalServicesProps> = ({ serviceIds }) => {
  if (!serviceIds || serviceIds.length === 0) {
    return null;
  }

  // Get additional service details
  const additionalServiceDetails = serviceIds.map(serviceId => 
    additionalServices.find(service => service.id === serviceId)
  ).filter(Boolean);

  if (additionalServiceDetails.length === 0) {
    return null;
  }

  return (
    <div className="mt-2 pt-2 border-t border-gray-800">
      <h4 className="text-sm font-medium text-gold mb-1">Additional Services:</h4>
      <ul className="text-sm text-gray-300">
        {additionalServiceDetails.map((service, index) => (
          <li key={index} className="flex items-center">
            <span className="mr-1">•</span> {service?.name} 
            {service?.price ? ` (£${service.price})` : ''} 
            {service?.duration ? ` (${service.duration} mins)` : ''}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdditionalServices;
