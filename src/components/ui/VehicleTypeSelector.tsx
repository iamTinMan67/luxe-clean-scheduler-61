
import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ClientType, JobType } from "@/lib/types";
import { Building, Home, Car, Truck, Box } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface VehicleTypeSelectorProps {
  selectedClientType: ClientType;
  selectedJobType: JobType;
  onClientTypeChange: (type: ClientType) => void;
  onJobTypeChange: (type: JobType) => void;
}

const VehicleTypeSelector = ({
  selectedClientType,
  selectedJobType,
  onClientTypeChange,
  onJobTypeChange,
}: VehicleTypeSelectorProps) => {
  const navigate = useNavigate();

  const clientTypes: Array<{ type: ClientType; label: string; description: string; icon: React.ReactNode; color: string }> = [
    { 
      type: "private", 
      label: "Private", 
      description: "For individual owners", 
      icon: <Home className="w-8 h-8" />,
      color: "border-blue-500 bg-blue-950/30"
    },
    { 
      type: "corporate", 
      label: "Commercial", 
      description: "For business fleets", 
      icon: <Building className="w-8 h-8" />,
      color: "border-green-500 bg-green-950/30"
    }
  ];

  const jobTypes: Array<{ type: JobType; label: string; icon: React.ReactNode }> = [
    { type: "car", label: "Car", icon: <Car className="w-8 h-8" /> },
    { type: "van", label: "Van", icon: <Truck className="w-8 h-8" /> },
    { type: "other", label: "Other", icon: <Box className="w-8 h-8" /> }
  ];

  const selectedClientConfig = clientTypes.find(c => c.type === selectedClientType);

  const handleJobTypeChange = (type: JobType) => {
    if (type === "other") {
      // Store client type for the simple booking form
      localStorage.setItem('selectedClientType', selectedClientType);
      
      // Redirect to simple booking form for "Other" job types
      toast.info("Redirecting to specialized form", {
        description: "Perfect for boats, caravans, and other services."
      });
      
      // Use replace to prevent back button issues
      navigate("/simple-booking", { replace: true });
    } else {
      onJobTypeChange(type);
    }
  };

  return (
    <div className="space-y-8">
      {/* Client Type Selection */}
      <div>
        <h3 className="text-lg font-semibold mb-3 text-white text-center">Select Client Type</h3>
        <div className="grid grid-cols-2 gap-3 max-w-md mx-auto">
          {clientTypes.map(({ type, label, description, icon, color }) => (
            <button
              key={type}
              onClick={() => onClientTypeChange(type)}
              className={cn(
                "relative aspect-square rounded-lg overflow-hidden group border-2 transition-all",
                selectedClientType === type ? color : "border-gray-800 bg-gray-900 hover:bg-gray-800"
              )}
            >
              <div className="absolute inset-0 flex flex-col items-center justify-center p-2">
                <div className="w-18 h-18 mb-2 flex items-center justify-center">
                  {icon}
                </div>
                <span className={cn(
                  "text-base font-medium transition-colors",
                  selectedClientType === type ? "text-white" : "text-gray-300 group-hover:text-white"
                )}>
                  {label}
                </span>
                <span className="text-xs text-gray-400 mt-1">
                  {description}
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

      {/* Job Type Selection */}
      <div>
        <h3 className="text-lg font-semibold mb-3 text-white text-center">Select Job Type</h3>
        <div className="grid grid-cols-3 gap-3 max-w-md mx-auto">
          {jobTypes.map(({ type, label, icon }) => (
            <button
              key={type}
              onClick={() => handleJobTypeChange(type)}
              className={cn(
                "relative aspect-square rounded-lg overflow-hidden group border-2 transition-all",
                selectedJobType === type ? 
                  selectedClientConfig?.color || "border-gold bg-black" : 
                  "border-gray-800 bg-gray-900 hover:bg-gray-800"
              )}
            >
              <div className="absolute inset-0 flex flex-col items-center justify-center p-2">
                <div className="w-18 h-18 mb-3 flex items-center justify-center">
                  {icon}
                </div>
                <span className={cn(
                  "text-base font-medium transition-colors",
                  selectedJobType === type ? "text-white" : "text-gray-300 group-hover:text-white"
                )}>
                  {label}
                </span>
                {selectedJobType === type && (
                  <motion.div
                    layoutId="selectedJob"
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
