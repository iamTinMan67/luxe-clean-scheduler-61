
import { PackageOption, AdditionalService } from "@/lib/types";

// Default package options - MODIFY THESE TO CHANGE PACKAGES AND PRICES
export const packageOptions: PackageOption[] = [
  {
    id: "basic",
    name: "Basic Package",
    type: "basic",
    description: "Essential exterior and interior cleaning for vehicles in good condition.",
    features: [
      "Exterior hand wash",
      "Wheel and tire cleaning",
      "Windows and mirrors cleaning",
      "Interior vacuum",
      "Dashboard and console wipe down",
      "Door panel cleaning"
    ],
    basePrice: {
      car: { small: 49, medium: 59, large: 69 },
      suv: { small: 59, medium: 69, large: 79 },
      van: { small: 69, medium: 79, large: 89 },
      truck: { small: 79, medium: 89, large: 99 },
      caravan: { small: 89, medium: 99, large: 109 }
    }
  },
  {
    id: "medium",
    name: "Medium Package",
    type: "medium",
    description: "Comprehensive cleaning with added protection for vehicles needing extra care.",
    features: [
      "All Basic Package services",
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
      van: { small: 109, medium: 119, large: 129 },
      truck: { small: 119, medium: 129, large: 139 },
      caravan: { small: 129, medium: 139, large: 149 }
    }
  },
  {
    id: "elite",
    name: "Elite Package",
    type: "elite",
    description: "Premium detailing with long-lasting protection for discerning vehicle owners.",
    features: [
      "All Medium Package services",
      "Paint correction",
      "Ceramic coating application",
      "Engine bay detailing",
      "Headlight restoration",
      "Premium interior conditioning",
      "Paint sealant",
      "Carpet shampooing"
    ],
    basePrice: {
      car: { small: 169, medium: 189, large: 209 },
      suv: { small: 189, medium: 209, large: 229 },
      van: { small: 209, medium: 229, large: 249 },
      truck: { small: 229, medium: 249, large: 269 },
      caravan: { small: 249, medium: 269, large: 289 }
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
