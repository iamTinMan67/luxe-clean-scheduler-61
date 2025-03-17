
import { useState } from "react";
import { Check, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { PackageOption, PackageType, VehicleType } from "@/lib/types";

interface ServiceCardProps {
  packageOption: PackageOption;
  selectedPackage: PackageType | null;
  vehicleType: VehicleType;
  onSelect: (packageType: PackageType) => void;
}

const ServiceCard = ({
  packageOption,
  selectedPackage,
  vehicleType,
  onSelect,
}: ServiceCardProps) => {
  const [showDetails, setShowDetails] = useState(false);
  const isSelected = selectedPackage === packageOption.type;
  
  const toggleDetails = () => setShowDetails(!showDetails);
  
  const handleSelect = () => {
    onSelect(packageOption.type);
  };
  
  // Since we're removing size, we'll use 'medium' as the default size for pricing
  const price = packageOption.basePrice[vehicleType].medium;
  
  return (
    <div 
      className={cn(
        "rounded-lg overflow-hidden transition-all duration-300 transform h-full flex flex-col",
        isSelected 
          ? "scale-[1.02] shadow-xl shadow-gold/20 border border-gold/50" 
          : "shadow-lg hover:shadow-xl hover:scale-[1.01] border border-gray-800 hover:border-gray-700",
        showDetails ? "shadow-xl" : ""
      )}
    >
      <div className={cn(
        "p-6 flex-1 flex flex-col",
        isSelected ? "bg-black" : "bg-black/80"
      )}>
        <div className="flex justify-between items-start">
          <div>
            <h3 className={cn(
              "text-xl font-bold mb-2 transition-colors",
              isSelected ? "text-gold" : "text-white"
            )}>
              {packageOption.name}
            </h3>
            <div className="text-2xl font-bold mb-4">
              <span className="text-gold">£{price}</span>
            </div>
          </div>
          
          {isSelected && (
            <div className="bg-gold text-black rounded-full p-1 flex-shrink-0">
              <Check size={18} />
            </div>
          )}
        </div>
        
        <p className="text-gray-300 mb-4 text-sm">{packageOption.description}</p>
        
        <div className="mt-auto">
          <button
            onClick={handleSelect}
            className={cn(
              "w-full rounded-md py-3 font-medium transition-all text-sm",
              isSelected 
                ? "gold-gradient text-black hover:shadow-md hover:shadow-gold/20" 
                : "bg-gray-800 text-white hover:bg-gray-700"
            )}
          >
            {isSelected ? "Selected" : "Select Package"}
          </button>
        </div>
      </div>
      
      <div className="bg-gray-900 p-4">
        <button
          className="flex items-center justify-between w-full text-sm text-gray-300 hover:text-gold transition-colors"
          onClick={toggleDetails}
          aria-expanded={showDetails}
        >
          <span>Package details</span>
          {showDetails ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
        
        {showDetails && (
          <div className="mt-4 space-y-2 animated-fade-in">
            <ul className="space-y-2">
              {packageOption.features.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <Check size={16} className="text-gold mr-2 mt-1 flex-shrink-0" />
                  <span className="text-gray-300 text-sm">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default ServiceCard;
