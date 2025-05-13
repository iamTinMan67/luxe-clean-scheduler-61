
import { ServiceTask } from "@/lib/types";

// Define service tasks
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
