
import ConditionSlider from "@/components/ui/ConditionSlider";

interface VehicleConditionSectionProps {
  vehicleCondition: number;
  setVehicleCondition: (value: number) => void;
}

const VehicleConditionSection = ({ 
  vehicleCondition, 
  setVehicleCondition 
}: VehicleConditionSectionProps) => {
  return (
    <ConditionSlider 
      value={vehicleCondition} 
      onChange={setVehicleCondition} 
    />
  );
};

export default VehicleConditionSection;
