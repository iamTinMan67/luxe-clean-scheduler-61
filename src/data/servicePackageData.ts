
import { PackageOption, AdditionalService, ServiceTask } from "@/lib/types";

// Define service tasks - NEW
export const serviceTasks: ServiceTask[] = [
  { 
    id: "handwash",
    name: "Handwash: Body & Wheels", 
    price: 15, 
    duration: 20, 
    included: true 
  },
  { 
    id: "hand-dry", 
    name: "Hand Dried", 
    price: 10, 
    duration: 15, 
    included: true 
  },
  { 
    id: "windows", 
    name: "Windows and mirrors cleaning", 
    price: 12, 
    duration: 15, 
    included: true 
  },
  { 
    id: "vacuum", 
    name: "Full Interior vacuum", 
    price: 15, 
    duration: 20, 
    included: true 
  },
  { 
    id: "dashboard", 
    name: "Dashboard and console wipe down", 
    price: 10, 
    duration: 15, 
    included: true 
  },
  { 
    id: "doors", 
    name: "Doors & Sills cleaning", 
    price: 12, 
    duration: 15, 
    included: true 
  },
  { 
    id: "clay", 
    name: "Clay bar treatment", 
    price: 25, 
    duration: 30, 
    included: false 
  },
  { 
    id: "wax", 
    name: "Wax protection", 
    price: 30, 
    duration: 25, 
    included: false 
  },
  { 
    id: "tire", 
    name: "Tire dressing", 
    price: 15, 
    duration: 15, 
    included: false 
  },
  { 
    id: "interior-deep", 
    name: "Interior deep cleaning", 
    price: 35, 
    duration: 45, 
    included: false 
  },
  { 
    id: "leather", 
    name: "Leather/upholstery treatment", 
    price: 25, 
    duration: 30, 
    included: false 
  },
  { 
    id: "air", 
    name: "Air freshening", 
    price: 5, 
    duration: 5, 
    included: false 
  },
  { 
    id: "paint-correction", 
    name: "Paint correction", 
    price: 80, 
    duration: 90, 
    included: false 
  },
  { 
    id: "ceramic", 
    name: "Ceramic coating application", 
    price: 150, 
    duration: 120, 
    included: false 
  },
  { 
    id: "engine-bay", 
    name: "Engine bay detailing", 
    price: 45, 
    duration: 60, 
    included: false 
  },
  { 
    id: "headlight", 
    name: "Headlight restoration", 
    price: 35, 
    duration: 45, 
    included: false 
  },
  { 
    id: "premium-interior", 
    name: "Premium interior conditioning", 
    price: 40, 
    duration: 60, 
    included: false 
  },
  { 
    id: "paint-sealant", 
    name: "Paint sealant", 
    price: 65, 
    duration: 75, 
    included: false 
  },
  { 
    id: "carpet", 
    name: "Carpet shampooing", 
    price: 55, 
    duration: 60, 
    included: false 
  }
];

// Default package options - Updated to use task-based pricing
export const packageOptions: PackageOption[] = [
  {
    id: "main",
    name: "Main Package",
    type: "main",
    description: "Essential cleaning services for your vehicle.",
    features: [
      "Handwash: Body & Wheels",
      "Hand Dried",
      "Windows and mirrors cleaning",
      "Full Interior vacuum",
      "Dashboard and console wipe down",
      "Doors & Sills cleaning"
    ],
    basePrice: 79, // Flat base price for the package
    tasks: [
      serviceTasks.find(task => task.id === "handwash")!,
      serviceTasks.find(task => task.id === "hand-dry")!,
      serviceTasks.find(task => task.id === "windows")!,
      serviceTasks.find(task => task.id === "vacuum")!,
      serviceTasks.find(task => task.id === "dashboard")!,
      serviceTasks.find(task => task.id === "doors")!
    ]
  },
  {
    id: "medium",
    name: "Medium Package",
    type: "medium",
    description: "Comprehensive cleaning with added protection for vehicles needing extra care.",
    features: [
      "All Main Package services",
      "Clay bar treatment",
      "Wax protection",
      "Tire dressing",
      "Interior deep cleaning",
      "Leather/upholstery treatment",
      "Air freshening"
    ],
    basePrice: 99, // Flat base price for the package
    tasks: [
      serviceTasks.find(task => task.id === "handwash")!,
      serviceTasks.find(task => task.id === "hand-dry")!,
      serviceTasks.find(task => task.id === "windows")!,
      serviceTasks.find(task => task.id === "vacuum")!,
      serviceTasks.find(task => task.id === "dashboard")!,
      serviceTasks.find(task => task.id === "doors")!,
      serviceTasks.find(task => task.id === "clay")!,
      serviceTasks.find(task => task.id === "wax")!,
      serviceTasks.find(task => task.id === "tire")!,
      serviceTasks.find(task => task.id === "interior-deep")!,
      serviceTasks.find(task => task.id === "leather")!,
      serviceTasks.find(task => task.id === "air")!
    ]
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
    basePrice: 199, // Flat base price for the package
    tasks: [
      serviceTasks.find(task => task.id === "handwash")!,
      serviceTasks.find(task => task.id === "hand-dry")!,
      serviceTasks.find(task => task.id === "windows")!,
      serviceTasks.find(task => task.id === "vacuum")!,
      serviceTasks.find(task => task.id === "dashboard")!,
      serviceTasks.find(task => task.id === "doors")!,
      serviceTasks.find(task => task.id === "clay")!,
      serviceTasks.find(task => task.id === "wax")!,
      serviceTasks.find(task => task.id === "tire")!,
      serviceTasks.find(task => task.id === "interior-deep")!,
      serviceTasks.find(task => task.id === "leather")!,
      serviceTasks.find(task => task.id === "air")!,
      serviceTasks.find(task => task.id === "paint-correction")!,
      serviceTasks.find(task => task.id === "ceramic")!,
      serviceTasks.find(task => task.id === "engine-bay")!,
      serviceTasks.find(task => task.id === "headlight")!,
      serviceTasks.find(task => task.id === "premium-interior")!,
      serviceTasks.find(task => task.id === "paint-sealant")!,
      serviceTasks.find(task => task.id === "carpet")!
    ]
  }
];

// Additional services - MODIFY THESE TO CHANGE ADDITIONAL SERVICES AND PRICES
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
