
import { Vehicle, VehicleType } from "@/lib/types";
import VehicleTypeSelector from "@/components/ui/VehicleTypeSelector";
import ConditionSlider from "@/components/ui/ConditionSlider";
import VehicleTabs from "@/components/service-package/VehicleTabs";

interface VehicleCustomizationProps {
  vehicles: Vehicle[];
  currentVehicleIndex: number;
  setCurrentVehicleIndex: (index: number) => void;
  currentVehicle: Vehicle;
  handleVehicleTypeChange: (type: VehicleType) => void;
  handleConditionChange: (condition: number) => void;
  handleAddVehicle: () => void;
  handleRemoveVehicle: (index: number) => void;
}

const VehicleCustomization: React.FC<VehicleCustomizationProps> = ({
  vehicles,
  currentVehicleIndex,
  setCurrentVehicleIndex,
  currentVehicle,
  handleVehicleTypeChange,
  handleConditionChange,
  handleAddVehicle,
  handleRemoveVehicle
}) => {
  return (
    <>
      {/* Vehicle Type Selector */}
      <div className="mb-16 text-center">
        <VehicleTypeSelector
          selectedType={currentVehicle.type}
          onTypeChange={handleVehicleTypeChange}
        />
      </div>
      
      {/* Vehicle Condition */}
      <div className="mb-8 max-w-3xl mx-auto">
        <ConditionSlider
          value={currentVehicle.condition}
          onChange={handleConditionChange}
        />
      </div>
      
      {/* Vehicle Selector Tabs */}
      <VehicleTabs
        vehicles={vehicles}
        currentVehicleIndex={currentVehicleIndex}
        setCurrentVehicleIndex={setCurrentVehicleIndex}
        handleAddVehicle={handleAddVehicle}
        handleRemoveVehicle={handleRemoveVehicle}
      />
    </>
  );
};

export default VehicleCustomization;
