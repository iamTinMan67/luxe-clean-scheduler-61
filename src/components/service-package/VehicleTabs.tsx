
import React from "react";
import { Trash2, Plus } from "lucide-react";
import { Vehicle } from "@/lib/types";

interface VehicleTabsProps {
  vehicles: Vehicle[];
  currentVehicleIndex: number;
  setCurrentVehicleIndex: (index: number) => void;
  handleAddVehicle: () => void;
  handleRemoveVehicle: (index: number) => void;
}

const VehicleTabs: React.FC<VehicleTabsProps> = ({
  vehicles,
  currentVehicleIndex,
  setCurrentVehicleIndex,
  handleAddVehicle,
  handleRemoveVehicle,
}) => {
  return (
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
  );
};

export default VehicleTabs;
