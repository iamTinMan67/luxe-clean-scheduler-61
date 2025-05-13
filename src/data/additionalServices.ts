
import { AdditionalService } from "@/lib/types";

// Additional services
export const additionalServices: AdditionalService[] = [
  { 
    id: "engine-detail", 
    name: "Engine Bay Detailing", 
    price: 45, 
    description: "Deep cleaning of the engine compartment", 
    duration: 60, 
    selected: false 
  },
  { 
    id: "headlight-restore", 
    name: "Headlight Restoration", 
    price: 35, 
    description: "Restores clarity to foggy or yellowed headlights", 
    duration: 45, 
    selected: false 
  },
  { 
    id: "odor-removal", 
    name: "Odor Removal Treatment", 
    price: 40, 
    description: "Eliminates persistent odors from the interior", 
    duration: 30, 
    selected: false 
  },
  { 
    id: "paint-correction", 
    name: "Paint Correction", 
    price: 80, 
    description: "Removes minor scratches and swirls", 
    duration: 90, 
    selected: false 
  },
  { 
    id: "ceramic-coating", 
    name: "Ceramic Coating", 
    price: 150, 
    description: "Long-lasting protection for your vehicle's paint", 
    duration: 120, 
    selected: false 
  },
  { 
    id: "leather-treatment", 
    name: "Leather Treatment", 
    price: 45, 
    description: "Deep conditioning for leather seats and surfaces", 
    duration: 60, 
    selected: false 
  }
];
