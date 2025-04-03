
import { PackageOption, AdditionalService } from "@/lib/types";

// Default package options - MODIFY THESE TO CHANGE PACKAGES AND PRICES
export const packageOptions: PackageOption[] = [
  {
    id: "medium",
    name: "Main Package",
    type: "small",
    description: "Comprehensive cleaning with added protection for vehicles needing extra care.",
    features: [
      "Exterior hand wash",
      "Wheel and tire cleaning",
      "Windows and mirrors cleaning",
      "Interior vacuum",
      "Dashboard and console wipe down",
      "Door panel cleaning",
      "Clay bar treatment",
      "Wax protection",
      "Tire dressing",
      "Interior deep cleaning",
      "Leather/upholstery treatment",
      "Air freshening"
    ],
    basePrice: {
      car: { small: 89, medium: 99, large: 109 },
      suv: { small: 99, medium: 109, large: 119 },
      van: { small: 109, medium: 119, large: 129 }
    }
  },
  {
    id: "elite",
    name: "Elite Package",
    type: "elite",
    description: "Premium detailing with long-lasting protection for discerning vehicle owners.",
    features: [
      "All Main Package services",
      "Paint correction",
      "Ceramic coating application",
      "Engine bay detailing",
      "Headlight restoration",
      "Premium interior conditioning",
      "Paint sealant",
      "Carpet shampooing"
    ],
    basePrice: {
      car: { small: 169 },
      van: { small: 209 }
    }
  }
];

// Additional services - MODIFY THESE TO CHANGE ADDITIONAL SERVICES AND PRICES
export const additionalServices: AdditionalService[] = [
  { id: "engine-detail", name: "Engine Bay Detailing", price: 45, description: "Deep cleaning of the engine compartment", selected: false },
  { id: "headlight-restore", name: "Headlight Restoration", price: 35, description: "Restores clarity to foggy or yellowed headlights", selected: false },
  { id: "odor-removal", name: "Odor Removal Treatment", price: 40, description: "Eliminates persistent odors from the interior", selected: false },
  { id: "paint-correction", name: "Paint Correction", price: 80, description: "Removes minor scratches and swirls", selected: false },
  { id: "ceramic-coating", name: "Ceramic Coating", price: 150, description: "Long-lasting protection for your vehicle's paint", selected: false },
  { id: "leather-treatment", name: "Leather Treatment", price: 45, description: "Deep conditioning for leather seats and surfaces", selected: false }
];
