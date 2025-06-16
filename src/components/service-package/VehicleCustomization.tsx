
import { Vehicle, JobType, ClientType } from "@/lib/types";
import VehicleTypeSelector from "@/components/ui/VehicleTypeSelector";
import VehicleTabs from "@/components/service-package/VehicleTabs";

interface VehicleCustomizationProps {
  vehicles: Vehicle[];
  currentVehicleIndex: number;
  setCurrentVehicleIndex: (index: number) => void;
  currentVehicle: Vehicle;
  handleClientTypeChange: (type: ClientType) => void;
  handleJobTypeChange: (type: JobType) => void; // Changed from handleVehicleTypeChange
  handleConditionChange: (condition: number) => void;
  handleAddVehicle: () => void;
  handleRemoveVehicle: (index: number) => void;
}

const VehicleCustomization: React.FC<VehicleCustomizationProps> = ({
  vehicles,
  currentVehicleIndex,
  setCurrentVehicleIndex,
  currentVehicle,
  handleClientTypeChange,
  handleJobTypeChange, // Changed from handleVehicleTypeChange
  handleAddVehicle,
  handleRemoveVehicle
}) => {
  return (
    <>
      {/* Vehicle Type Selector */}
      <div className="mb-16 text-center">
        <VehicleTypeSelector
          selectedClientType={currentVehicle.clientType}
          selectedJobType={currentVehicle.type} // Changed from selectedVehicleType
          onClientTypeChange={handleClientTypeChange}
          onJobTypeChange={handleJobTypeChange} // Changed from onVehicleTypeChange
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
