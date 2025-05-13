
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Components
import ServiceHero from "@/components/service-package/ServiceHero";
import PackageSelection from "@/components/service-package/PackageSelection";
import AdditionalServicesSelection from "@/components/service-package/AdditionalServicesSelection";
import PriceSummary from "@/components/service-package/PriceSummary";
import VehicleCustomization from "@/components/service-package/VehicleCustomization";

// Data and hooks
import { packageOptions } from "@/data/packageOptions";
import { additionalServices } from "@/data/additionalServices";
import { useVehicleState } from "@/hooks/useVehicleState";
import { calculateTotalPrice } from "@/utils/priceCalculator";

const ServicePackage = () => {
  const navigate = useNavigate();
  
  const {
    vehicles,
    currentVehicleIndex,
    setCurrentVehicleIndex,
    currentVehicle,
    handleVehicleTypeChange,
    handleConditionChange,
    handlePackageSelect,
    handleAdditionalServiceToggle,
    handleAddVehicle,
    handleRemoveVehicle
  } = useVehicleState(additionalServices);
  
  // Calculate total price
  const getTotalPrice = () => {
    return calculateTotalPrice(vehicles, packageOptions);
  };
  
  // Continue to booking
  const handleContinueToBooking = () => {
    // In a real app, we'd save this data to context/store or send to API
    localStorage.setItem('vehicleDetails', JSON.stringify(vehicles));
    localStorage.setItem('totalPrice', getTotalPrice().toString());
    
    // Force scroll to top before navigation
    window.scrollTo(0, 0);
    navigate('/booking');
  };
  
  // Scroll to top on page load
  useEffect(() => {
    // Immediate scroll on component mount
    window.scrollTo(0, 0);
    
    // Also scroll after a short delay to ensure all content is loaded
    const timeoutId = setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: 'instant'
      });
    }, 50);
    
    return () => clearTimeout(timeoutId);
  }, []);
  
  return (
    <div className="min-h-screen bg-black">
      {/* Hero section */}
      <section className="relative py-24 bg-black overflow-hidden">
        <div className="container mx-auto px-4">
          {/* Hero Content */}
          <ServiceHero />
          
          {/* Package Selection */}
          <PackageSelection
            packageOptions={packageOptions}
            selectedPackage={currentVehicle.package}
            vehicleType={currentVehicle.type}
            onSelect={handlePackageSelect}
          />
          
          {/* Additional Services */}
          <AdditionalServicesSelection
            additionalServices={additionalServices}
            selectedServices={currentVehicle.additionalServices}
            onToggleService={handleAdditionalServiceToggle}
          />
          
          {/* Vehicle Customization */}
          <VehicleCustomization 
            vehicles={vehicles}
            currentVehicleIndex={currentVehicleIndex}
            setCurrentVehicleIndex={setCurrentVehicleIndex}
            currentVehicle={currentVehicle}
            handleVehicleTypeChange={handleVehicleTypeChange}
            handleConditionChange={handleConditionChange}
            handleAddVehicle={handleAddVehicle}
            handleRemoveVehicle={handleRemoveVehicle}
          />
          
          {/* Price Summary */}
          <PriceSummary
            vehicles={vehicles}
            packageOptions={packageOptions}
            calculateTotalPrice={getTotalPrice}
            onContinueToBooking={handleContinueToBooking}
          />
        </div>
      </section>
    </div>
  );
};

export default ServicePackage;
