
import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { VehicleType } from "@/lib/types";

interface VehicleTypeSelectorProps {
  selectedType: VehicleType;
  onTypeChange: (type: VehicleType) => void;
}

const VehicleTypeSelector = ({
  selectedType,
  onTypeChange,
}: VehicleTypeSelectorProps) => {
  const vehicleTypes: Array<{ type: VehicleType; label: string }> = [
    { type: "car", label: "Car" },
    { type: "van", label: "Van" }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-3 text-white text-center">Select Vehicle Type</h3>
        <div className="grid grid-cols-2 gap-3 max-w-md mx-auto">
          {vehicleTypes.map(({ type, label }) => (
            <button
              key={type}
              onClick={() => onTypeChange(type)}
              className={cn(
                "relative aspect-square rounded-lg overflow-hidden group",
                selectedType === type ? "ring-2 ring-gold" : "ring-1 ring-gray-800"
              )}
            >
              <div className={cn(
                "absolute inset-0 flex flex-col items-center justify-center p-2 transition-colors bg-gray-900 group-hover:bg-gray-800",
                selectedType === type ? "bg-black" : ""
              )}>
                <div className="w-18 h-18 mb-3 flex items-center justify-center">
                  <VehicleIcon type={type} selected={selectedType === type} />
                </div>
                <span className={cn(
                  "text-base font-medium transition-colors",
                  selectedType === type ? "text-gold" : "text-gray-300 group-hover:text-white"
                )}>
                  {label}
                </span>
                {selectedType === type && (
                  <motion.div
                    layoutId="selectedVehicle"
                    className="absolute bottom-0 h-0.5 w-full bg-gold"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                )}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

// Simple vehicle icons - in a real app, you would use SVG icons or images
const VehicleIcon = ({ type, selected }: { type: VehicleType; selected: boolean }) => {
  const getVehicleEmoji = () => {
    switch (type) {
      case "car":
        return "🚗";
      case "van":
        return "🚐";
      default:
        return "🚗";
    }
  };

  return (
    <div className={cn(
      "text-3xl transition-transform transform",
      selected ? "scale-110" : "scale-100"
    )}>
      {getVehicleEmoji()}
    </div>
  );
};

export default VehicleTypeSelector;
