
import React from "react";
import { PackageOption, PackageType, VehicleType } from "@/lib/types";
import ServiceCard from "@/components/ui/ServiceCard";

interface PackageSelectionProps {
  packageOptions: PackageOption[];
  selectedPackage: PackageType | null;
  vehicleType: VehicleType;
  onSelect: (packageType: PackageType) => void;
}

const PackageSelection: React.FC<PackageSelectionProps> = ({
  packageOptions,
  selectedPackage,
  vehicleType,
  onSelect,
}) => {
  return (
    <div className="mb-16">
      <h2 className="text-2xl font-bold mb-8 text-center text-white">
        Browse our services amd select your <span className="text-gold">package</span>
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {packageOptions.map((packageOption) => (
          <ServiceCard
            key={packageOption.id}
            packageOption={packageOption}
            selectedPackage={selectedPackage}
            vehicleType={vehicleType}
            onSelect={onSelect}
          />
        ))}
      </div>
    </div>
  );
};

export default PackageSelection;
