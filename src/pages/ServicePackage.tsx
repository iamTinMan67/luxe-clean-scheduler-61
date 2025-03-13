
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { PackageType, VehicleType, VehicleSize, AdditionalService, Vehicle, PackageOption } from "@/lib/types";
import ServiceCard from "@/components/ui/ServiceCard";
import VehicleTypeSelector from "@/components/ui/VehicleTypeSelector";
import ConditionSlider from "@/components/ui/ConditionSlider";

const ServicePackage = () => {
  const navigate = useNavigate();
  
  // Default package options - MODIFY THESE TO CHANGE PACKAGES AND PRICES
  const packageOptions: PackageOption[] = [
    {
      id: "basic",
      name: "Basic Package",
      type: "basic",
      description: "Essential exterior and interior cleaning for vehicles in good condition.",
      features: [
        "Exterior hand wash",
        "Wheel and tire cleaning",
        "Windows and mirrors cleaning",
        "Interior vacuum",
        "Dashboard and console wipe down",
        "Door panel cleaning"
      ],
      basePrice: {
        car: { small: 49, medium: 59, large: 69 },
        suv: { small: 59, medium: 69, large: 79 },
        van: { small: 69, medium: 79, large: 89 },
        truck: { small: 79, medium: 89, large: 99 },
        caravan: { small: 89, medium: 99, large: 109 }
      }
    },
    {
      id: "medium",
      name: "Medium Package",
      type: "medium",
      description: "Comprehensive cleaning with added protection for vehicles needing extra care.",
      features: [
        "All Basic Package services",
        "Clay bar treatment",
        "Wax protection",
        "Tire dressing",
        "Interior deep cleaning",
        "Leather/upholstery treatment",
        "Air freshening"
      ],
      basePrice: {
        car: { small: 89, medium: 99, large: 109 },
        suv: { small: 99, medium: 109, large: 119 },
        van: { small: 109, medium: 119, large: 129 },
        truck: { small: 119, medium: 129, large: 139 },
        caravan: { small: 129, medium: 139, large: 149 }
      }
    },
    {
      id: "elite",
      name: "Elite Package",
      type: "elite",
      description: "Premium detailing with long-lasting protection for discerning vehicle owners.",
      features: [
        "All Medium Package services",
        "Paint correction",
        "Ceramic coating application",
        "Engine bay detailing",
        "Headlight restoration",
        "Premium interior conditioning",
        "Paint sealant",
        "Carpet shampooing"
      ],
      basePrice: {
        car: { small: 169, medium: 189, large: 209 },
        suv: { small: 189, medium: 209, large: 229 },
        van: { small: 209, medium: 229, large: 249 },
        truck: { small: 229, medium: 249, large: 269 },
        caravan: { small: 249, medium: 269, large: 289 }
      }
    }
  ];
  
  // Additional services - MODIFY THESE TO CHANGE ADDITIONAL SERVICES AND PRICES
  const additionalServices: AdditionalService[] = [
    { id: "engine-detail", name: "Engine Bay Detailing", price: 45, description: "Deep cleaning of the engine compartment", selected: false },
    { id: "headlight-restore", name: "Headlight Restoration", price: 35, description: "Restores clarity to foggy or yellowed headlights", selected: false },
    { id: "odor-removal", name: "Odor Removal Treatment", price: 40, description: "Eliminates persistent odors from the interior", selected: false },
    { id: "paint-correction", name: "Paint Correction", price: 80, description: "Removes minor scratches and swirls", selected: false },
    { id: "ceramic-coating", name: "Ceramic Coating", price: 150, description: "Long-lasting protection for your vehicle's paint", selected: false },
    { id: "leather-treatment", name: "Leather Treatment", price: 45, description: "Deep conditioning for leather seats and surfaces", selected: false }
  ];
  
  // State for the current vehicle
  const [vehicles, setVehicles] = useState<Vehicle[]>([
    {
      id: "1",
      type: "car",
      size: "medium",
      condition: 5,
      package: "basic" as PackageType,
      additionalServices: []
    }
  ]);
  
  const [currentVehicleIndex, setCurrentVehicleIndex] = useState(0);
  const currentVehicle = vehicles[currentVehicleIndex];
  
  // Update vehicle type
  const handleVehicleTypeChange = (type: VehicleType) => {
    setVehicles(prev => {
      const updated = [...prev];
      updated[currentVehicleIndex] = {
        ...updated[currentVehicleIndex],
        type
      };
      return updated;
    });
  };
  
  // Update vehicle size
  const handleVehicleSizeChange = (size: VehicleSize) => {
    setVehicles(prev => {
      const updated = [...prev];
      updated[currentVehicleIndex] = {
        ...updated[currentVehicleIndex],
        size
      };
      return updated;
    });
  };
  
  // Update vehicle condition
  const handleConditionChange = (condition: number) => {
    setVehicles(prev => {
      const updated = [...prev];
      updated[currentVehicleIndex] = {
        ...updated[currentVehicleIndex],
        condition
      };
      return updated;
    });
  };
  
  // Update package selection
  const handlePackageSelect = (packageType: PackageType) => {
    setVehicles(prev => {
      const updated = [...prev];
      updated[currentVehicleIndex] = {
        ...updated[currentVehicleIndex],
        package: packageType
      };
      return updated;
    });
  };
  
  // Toggle additional service
  const handleAdditionalServiceToggle = (serviceId: string) => {
    setVehicles(prev => {
      const updated = [...prev];
      const currentServices = [...updated[currentVehicleIndex].additionalServices];
      
      const existingIndex = currentServices.findIndex(s => s.id === serviceId);
      
      if (existingIndex >= 0) {
        // Remove the service
        currentServices.splice(existingIndex, 1);
      } else {
        // Add the service
        const serviceToAdd = additionalServices.find(s => s.id === serviceId);
        if (serviceToAdd) {
          currentServices.push({...serviceToAdd, selected: true});
        }
      }
      
      updated[currentVehicleIndex] = {
        ...updated[currentVehicleIndex],
        additionalServices: currentServices
      };
      
      return updated;
    });
  };
  
  // Add another vehicle
  const handleAddVehicle = () => {
    const newVehicle: Vehicle = {
      id: `${vehicles.length + 1}`,
      type: "car",
      size: "medium",
      condition: 5,
      package: "basic" as PackageType,
      additionalServices: []
    };
    
    setVehicles(prev => [...prev, newVehicle]);
    setCurrentVehicleIndex(vehicles.length);
    
    toast.success("New vehicle added", {
      description: `Vehicle ${vehicles.length + 1} added to your quote.`
    });
  };
  
  // Remove a vehicle
  const handleRemoveVehicle = (index: number) => {
    if (vehicles.length <= 1) {
      toast.error("Cannot remove", {
        description: "You must have at least one vehicle."
      });
      return;
    }
    
    setVehicles(prev => {
      const updated = [...prev];
      updated.splice(index, 1);
      return updated;
    });
    
    if (currentVehicleIndex >= index && currentVehicleIndex > 0) {
      setCurrentVehicleIndex(currentVehicleIndex - 1);
    }
    
    toast.success("Vehicle removed", {
      description: `Vehicle has been removed from your quote.`
    });
  };
  
  // Calculate total price
  const calculateTotalPrice = () => {
    return vehicles.reduce((total, vehicle) => {
      // Get base package price
      const packageOption = packageOptions.find(p => p.type === vehicle.package);
      const basePrice = packageOption?.basePrice[vehicle.type][vehicle.size] || 0;
      
      // Add additional services
      const additionalPrice = vehicle.additionalServices.reduce(
        (sum, service) => sum + service.price, 
        0
      );
      
      return total + basePrice + additionalPrice;
    }, 0);
  };
  
  // Continue to booking
  const handleContinueToBooking = () => {
    // In a real app, we'd save this data to context/store or send to API
    localStorage.setItem('vehicleDetails', JSON.stringify(vehicles));
    localStorage.setItem('totalPrice', calculateTotalPrice().toString());
    
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
          
          {/* Vehicle Selector Tabs */}
          <div className="flex flex-wrap gap-3 justify-center mb-8">
            {vehicles.map((vehicle, index) => (
              <button
                key={index}
                className={`px-4 py-2 rounded-full ${
                  currentVehicleIndex === index
                    ? "gold-gradient text-black"
                    : "bg-gray-800 text-white hover:bg-gray-700"
                } flex items-center`}
                onClick={() => setCurrentVehicleIndex(index)}
              >
                Vehicle {index + 1}
                {vehicles.length > 1 && (
                  <button
                    className="ml-2 p-1 text-black rounded-full hover:bg-black/20"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveVehicle(index);
                    }}
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </button>
            ))}
            
            <button
              className="px-4 py-2 rounded-full bg-gray-800 text-white hover:bg-gray-700 flex items-center"
              onClick={handleAddVehicle}
            >
              <Plus size={16} className="mr-1" />
              Add Vehicle
            </button>
          </div>
          
          <div className="mb-16">
            <VehicleTypeSelector
              selectedType={currentVehicle.type}
              selectedSize={currentVehicle.size}
              onTypeChange={handleVehicleTypeChange}
              onSizeChange={handleVehicleSizeChange}
            />
          </div>
          
          <div className="mb-16 max-w-3xl mx-auto">
            <ConditionSlider
              value={currentVehicle.condition}
              onChange={handleConditionChange}
            />
          </div>
          
          {/* Package Selection */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold mb-8 text-center text-white">
              Choose Your <span className="text-gold">Package</span>
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {packageOptions.map((packageOption) => (
                <ServiceCard
                  key={packageOption.id}
                  packageOption={packageOption}
                  selectedPackage={currentVehicle.package}
                  vehicleType={currentVehicle.type}
                  vehicleSize={currentVehicle.size}
                  onSelect={handlePackageSelect}
                />
              ))}
            </div>
          </div>
          
          {/* Additional Services */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold mb-8 text-center text-white">
              Additional <span className="text-gold">Services</span>
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {additionalServices.map((service) => {
                const isSelected = currentVehicle.additionalServices.some(s => s.id === service.id);
                
                return (
                  <div
                    key={service.id}
                    className={`border rounded-lg p-4 flex items-start cursor-pointer transition-all ${
                      isSelected
                        ? "border-gold bg-gold/10"
                        : "border-gray-800 hover:border-gray-700 bg-gray-900/50"
                    }`}
                    onClick={() => handleAdditionalServiceToggle(service.id)}
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
          
          {/* Price Summary */}
          <div className="max-w-3xl mx-auto bg-gray-900/50 backdrop-blur-sm rounded-lg p-6 mb-16 border border-gray-800">
            <h2 className="text-2xl font-bold mb-4 text-white">Summary</h2>
            
            <div className="space-y-3 mb-6">
              {vehicles.map((vehicle, index) => {
                const packageOption = packageOptions.find(p => p.type === vehicle.package);
                const basePrice = packageOption?.basePrice[vehicle.type][vehicle.size] || 0;
                
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
                        {vehicle.type.charAt(0).toUpperCase() + vehicle.type.slice(1)} ({vehicle.size}) - 
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
              onClick={handleContinueToBooking}
              className="gold-gradient text-black px-8 py-3 rounded-md font-medium text-lg inline-flex items-center hover:shadow-lg hover:shadow-gold/20 transition-all"
            >
              Continue to Booking
              <ArrowRight className="ml-2 h-5 w-5" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ServicePackage;
