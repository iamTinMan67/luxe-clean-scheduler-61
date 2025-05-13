
import { PackageOption } from "@/lib/types";
import { serviceTasks } from "./serviceTasks";

// Default package options
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
