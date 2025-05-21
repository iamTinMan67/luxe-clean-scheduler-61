
import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ClientType, VehicleType } from "@/lib/types";
import { Building, Home, Car, Truck, Box } from "lucide-react";

interface VehicleTypeSelectorProps {
  selectedClientType: ClientType;
  selectedVehicleType: VehicleType;
  onClientTypeChange: (type: ClientType) => void;
  onVehicleTypeChange: (type: VehicleType) => void;
}

const VehicleTypeSelector = ({
  selectedClientType,
  selectedVehicleType,
  onClientTypeChange,
  onVehicleTypeChange,
}: VehicleTypeSelectorProps) => {
  const clientTypes: Array<{ type: ClientType; label: string; icon: React.ReactNode }> = [
    { type: "private", label: "Private", icon: <Home className="w-8 h-8" /> },
    { type: "corporate", label: "Corporate", icon: <Building className="w-8 h-8" /> }
  ];

  const vehicleTypes: Array<{ type: VehicleType; label: string; icon: React.ReactNode }> = [
    { type: "car", label: "Car", icon: <Car className="w-8 h-8" /> },
    { type: "van", label: "Van", icon: <Truck className="w-8 h-8" /> },
    { type: "other", label: "Other", icon: <Box className="w-8 h-8" /> }
  ];

  return (
    <div className="space-y-8">
      {/* Client Type Selection */}
      <div>
        <h3 className="text-lg font-semibold mb-3 text-white text-center">Select Client Type</h3>
        <div className="grid grid-cols-2 gap-3 max-w-md mx-auto">
          {clientTypes.map(({ type, label, icon }) => (
            <button
              key={type}
              onClick={() => onClientTypeChange(type)}
              className={cn(
                "relative aspect-square rounded-lg overflow-hidden group",
                selectedClientType === type ? "ring-2 ring-gold" : "ring-1 ring-gray-800"
              )}
            >
              <div className={cn(
                "absolute inset-0 flex flex-col items-center justify-center p-2 transition-colors bg-gray-900 group-hover:bg-gray-800",
                selectedClientType === type ? "bg-black" : ""
              )}>
                <div className="w-18 h-18 mb-3 flex items-center justify-center">
                  {icon}
                </div>
                <span className={cn(
                  "text-base font-medium transition-colors",
                  selectedClientType === type ? "text-gold" : "text-gray-300 group-hover:text-white"
                )}>
                  {label}
                </span>
                {selectedClientType === type && (
                  <motion.div
                    layoutId="selectedClient"
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

      {/* Vehicle Type Selection */}
      <div>
        <h3 className="text-lg font-semibold mb-3 text-white text-center">Select Vehicle Type</h3>
        <div className="grid grid-cols-3 gap-3 max-w-md mx-auto">
          {vehicleTypes.map(({ type, label, icon }) => (
            <button
              key={type}
              onClick={() => onVehicleTypeChange(type)}
              className={cn(
                "relative aspect-square rounded-lg overflow-hidden group",
                selectedVehicleType === type ? "ring-2 ring-gold" : "ring-1 ring-gray-800"
              )}
            >
              <div className={cn(
                "absolute inset-0 flex flex-col items-center justify-center p-2 transition-colors bg-gray-900 group-hover:bg-gray-800",
                selectedVehicleType === type ? "bg-black" : ""
              )}>
                <div className="w-18 h-18 mb-3 flex items-center justify-center">
                  {icon}
                </div>
                <span className={cn(
                  "text-base font-medium transition-colors",
                  selectedVehicleType === type ? "text-gold" : "text-gray-300 group-hover:text-white"
                )}>
                  {label}
                </span>
                {selectedVehicleType === type && (
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

export default VehicleTypeSelector;
