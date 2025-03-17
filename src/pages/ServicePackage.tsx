
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

// Components
import VehicleTabs from "@/components/service-package/VehicleTabs";
import VehicleTypeSelector from "@/components/ui/VehicleTypeSelector";
import ConditionSlider from "@/components/ui/ConditionSlider";
import PackageSelection from "@/components/service-package/PackageSelection";
import AdditionalServicesSelection from "@/components/service-package/AdditionalServicesSelection";
import PriceSummary from "@/components/service-package/PriceSummary";

// Data and hooks
import { packageOptions, additionalServices } from "@/data/servicePackageData";
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
    
    navigate('/booking');
  };
  
  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  return (
    <div className="min-h-screen bg-black">
      {/* Hero section */}
      <section className="relative py-24 bg-black overflow-hidden">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              Customize Your <span className="text-gold">Service Package</span>
            </h1>
            <p className="text-xl text-gray-300">
              Select the perfect cleaning package for your vehicle and add any additional services you require.
            </p>
          </motion.div>
          
          <div className="mb-16">
            <VehicleTypeSelector
              selectedType={currentVehicle.type}
              onTypeChange={handleVehicleTypeChange}
            />
          </div>
          
          <div className="mb-16 max-w-3xl mx-auto">
            <ConditionSlider
              value={currentVehicle.condition}
              onChange={handleConditionChange}
            />
          </div>
          
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
          
          {/* Vehicle Selector Tabs - Moved just above Price Summary */}
          <VehicleTabs
            vehicles={vehicles}
            currentVehicleIndex={currentVehicleIndex}
            setCurrentVehicleIndex={setCurrentVehicleIndex}
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
