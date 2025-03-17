
import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { VehicleType, VehicleSize } from "@/lib/types";

interface VehicleTypeSelectorProps {
  selectedType: VehicleType;
  selectedSize: VehicleSize;
  onTypeChange: (type: VehicleType) => void;
  onSizeChange: (size: VehicleSize) => void;
}

const VehicleTypeSelector = ({
  selectedType,
  selectedSize,
  onTypeChange,
  onSizeChange,
}: VehicleTypeSelectorProps) => {
  const vehicleTypes: Array<{ type: VehicleType; label: string }> = [
    { type: "car", label: "Car" },
    { type: "suv", label: "SUV" },
    { type: "van", label: "Van" },
    { type: "truck", label: "Truck" },
    { type: "caravan", label: "Caravan" }
  ];

  const vehicleSizes: Array<{ size: VehicleSize; label: string }> = [
    { size: "small", label: "Small" },
    { size: "medium", label: "Medium" },
    { size: "large", label: "Large" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-3 text-white">Select Vehicle Type</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
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
                  {/* Increased size of icon container by 50% from w-12 h-12 to w-18 h-18 */}
                  <VehicleIcon type={type} selected={selectedType === type} />
                </div>
                <span className={cn(
                  "text-base font-medium transition-colors", // Increased text size from text-sm to text-base
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

      <div>
        <h3 className="text-lg font-semibold mb-3 text-white">Select Size</h3>
        <div className="flex flex-wrap gap-3">
          {vehicleSizes.map(({ size, label }) => (
            <button
              key={size}
              onClick={() => onSizeChange(size)}
              className={cn(
                "relative px-6 py-3 rounded-md transition-colors",
                selectedSize === size
                  ? "gold-gradient text-black"
                  : "bg-gray-900 text-gray-300 hover:bg-gray-800 hover:text-white"
              )}
            >
              {label}
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
      case "suv":
        return "🚙";
      case "van":
        return "🚐";
      case "truck":
        return "🚚";
      case "caravan":
        return "🚍";
      default:
        return "🚗";
    }
  };

  return (
    <div className={cn(
      "text-3xl transition-transform transform", // Increased text size from text-2xl to text-3xl
      selected ? "scale-110" : "scale-100"
    )}>
      {getVehicleEmoji()}
    </div>
  );
};

export default VehicleTypeSelector;
