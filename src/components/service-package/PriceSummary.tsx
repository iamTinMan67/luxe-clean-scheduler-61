
import React from "react";
import { Vehicle, PackageOption } from "@/lib/types";
import { ArrowRight } from "lucide-react";

interface PriceSummaryProps {
  vehicles: Vehicle[];
  packageOptions: PackageOption[];
  calculateTotalPrice: () => number;
  onContinueToBooking: () => void;
}

const PriceSummary: React.FC<PriceSummaryProps> = ({
  vehicles,
  packageOptions,
  calculateTotalPrice,
  onContinueToBooking,
}) => {
  const handleContinueClick = () => {
    // Force scroll to top before navigation
    window.scrollTo(0, 0);
    onContinueToBooking();
  };

  return (
    <>
      <div className="max-w-3xl mx-auto bg-gray-900/50 backdrop-blur-sm rounded-lg p-6 mb-16 border border-gray-800">
        <h2 className="text-2xl font-bold mb-4 text-white">Summary</h2>
        
        <div className="space-y-3 mb-6">
          {vehicles.map((vehicle, index) => {
            const packageOption = packageOptions.find(p => p.type === vehicle.package);
            const basePrice = packageOption?.basePrice || 0;
            
            const additionalPrice = vehicle.additionalServices.reduce(
              (sum, service) => sum + service.price, 
              0
            );
            
            const vehicleTotal = basePrice + additionalPrice;
            
            return (
              <div key={index} className="flex justify-between">
                <div>
                  <span className="text-white">Vehicle {index + 1}: </span>
                  <span className="text-gray-400">
                    {vehicle.type.charAt(0).toUpperCase() + vehicle.type.slice(1)} - 
                    {packageOption?.name}
                  </span>
                  
                  {vehicle.additionalServices.length > 0 && (
                    <div className="text-sm text-gray-500 pl-4">
                      + {vehicle.additionalServices.length} additional service(s)
                    </div>
                  )}
                </div>
                <span className="text-gold font-medium">£{vehicleTotal}</span>
              </div>
            );
          })}
        </div>
        
        <div className="border-t border-gray-700 pt-4 flex justify-between items-center">
          <span className="text-xl font-bold text-white">Total</span>
          <span className="text-2xl font-bold text-gold">£{calculateTotalPrice()}</span>
        </div>
      </div>
      
      {/* CTA Button */}
      <div className="text-center">
        <button
          onClick={handleContinueClick}
          className="gold-gradient text-black px-8 py-3 rounded-md font-medium text-lg inline-flex items-center hover:shadow-lg hover:shadow-gold/20 transition-all"
        >
          Continue to Booking
          <ArrowRight className="ml-2 h-5 w-5" />
        </button>
      </div>
    </>
  );
};

export default PriceSummary;
