
import React from "react";
import { AdditionalService } from "@/lib/types";

interface AdditionalServicesSelectionProps {
  additionalServices: AdditionalService[];
  selectedServices: AdditionalService[];
  onToggleService: (serviceId: string) => void;
}

const AdditionalServicesSelection: React.FC<AdditionalServicesSelectionProps> = ({
  additionalServices,
  selectedServices,
  onToggleService,
}) => {
  return (
    <div className="mb-16">
      <h2 className="text-2xl font-bold mb-8 text-center text-white">
        Additional <span className="text-gold">Services</span>
      </h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {additionalServices.map((service) => {
          const isSelected = selectedServices.some(s => s.id === service.id);
          
          return (
            <div
              key={service.id}
              className={`border rounded-lg p-4 flex items-start cursor-pointer transition-all ${
                isSelected
                  ? "border-gold bg-gold/10"
                  : "border-gray-800 hover:border-gray-700 bg-gray-900/50"
              }`}
              onClick={() => onToggleService(service.id)}
            >
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h3 className="font-medium text-white">{service.name}</h3>
                  <span className="text-gold font-semibold">£{service.price}</span>
                </div>
                <p className="text-sm text-gray-400 mt-1">{service.description}</p>
              </div>
              <div className={`w-5 h-5 rounded-full flex-shrink-0 ml-3 border ${
                isSelected
                  ? "bg-gold border-gold"
                  : "border-gray-600"
              } flex items-center justify-center`}>
                {isSelected && <div className="w-3 h-3 rounded-full bg-black"></div>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AdditionalServicesSelection;
