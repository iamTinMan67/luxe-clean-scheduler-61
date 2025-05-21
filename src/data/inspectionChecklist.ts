
import { InspectionChecklistItem } from "@/types/task";

// Default checklist items for all vehicle types
export const defaultChecklistItems: InspectionChecklistItem[] = [
  { id: 1, label: "Exterior body condition documented", completed: false, required: true, vehicleType: 'all' },
  { id: 2, label: "Interior condition documented", completed: false, required: true, vehicleType: 'all' },
  { id: 3, label: "Existing damage photographed", completed: false, required: true, vehicleType: 'all' },
  { id: 4, label: "Personal items noted and secured", completed: false, required: true, vehicleType: 'all' },
];

// Get vehicle-specific checklist items
export const getChecklistItemsForVehicle = (vehicleType: 'car' | 'van' | string): InspectionChecklistItem[] => {
  // Return default items for all vehicle types
  return [...defaultChecklistItems];
};
