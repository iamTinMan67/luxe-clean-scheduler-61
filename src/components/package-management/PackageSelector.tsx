
import { Card, CardContent } from "@/components/ui/card";
import { PackageOption, PackageType } from "@/lib/types";

interface PackageSelectorProps {
  packages: PackageOption[];
  selectedPackage: PackageType | null;
  onSelectPackage: (packageType: PackageType) => void;
}

const PackageSelector = ({ 
  packages, 
  selectedPackage, 
  onSelectPackage 
}: PackageSelectorProps) => {
  return (
    <Card className="bg-black/60 border-gold/30">
      <CardContent className="p-4">
        <h3 className="text-lg font-medium text-white mb-4">Select Package</h3>
        <div className="space-y-2">
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              className={`p-3 rounded-md cursor-pointer transition-all ${
                selectedPackage === pkg.type
                  ? "bg-gold/20 border border-gold"
                  : "bg-black/40 border border-gold/20 hover:border-gold/40"
              }`}
              onClick={() => onSelectPackage(pkg.type)}
            >
              <div className="flex justify-between items-center">
                <h4 className="font-medium text-white">{pkg.name}</h4>
                <span className="text-gold font-medium">£{pkg.basePrice}</span>
              </div>
              <p className="text-sm text-gold/70 mt-1">{pkg.description}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default PackageSelector;
