
import { InspectionChecklistItem } from "@/types/task";

// Default checklist items for all vehicle types
export const defaultChecklistItems: InspectionChecklistItem[] = [
  { id: 1, label: "Exterior body condition documented", completed: false, required: true, vehicleType: 'all' },
  { id: 2, label: "Interior condition documented", completed: false, required: true, vehicleType: 'all' },
  { id: 3, label: "Existing damage photographed", completed: false, required: true, vehicleType: 'all' },
  { id: 4, label: "Personal items noted and secured", completed: false, required: true, vehicleType: 'all' },
];

// Car-specific checklist items
export const carChecklistItems: InspectionChecklistItem[] = [
  { id: 101, label: "Dashboard controls checked", completed: false, required: false, vehicleType: 'car' },
  { id: 102, label: "Glove compartment inspected", completed: false, required: false, vehicleType: 'car' },
  { id: 103, label: "Trunk condition documented", completed: false, required: false, vehicleType: 'car' },
];

// Van-specific checklist items
export const vanChecklistItems: InspectionChecklistItem[] = [
  { id: 201, label: "Cargo area inspected", completed: false, required: false, vehicleType: 'van' },
  { id: 202, label: "Sliding door operation verified", completed: false, required: false, vehicleType: 'van' },
  { id: 203, label: "Roof height noted", completed: false, required: false, vehicleType: 'van' },
];

// Get vehicle-specific checklist items
export const getChecklistItemsForVehicle = (vehicleType: 'car' | 'van' | string): InspectionChecklistItem[] => {
  // Start with default items
  let items = [...defaultChecklistItems];
  
  // Add vehicle-specific items
  if (vehicleType === 'car') {
    items = [...items, ...carChecklistItems];
  } else if (vehicleType === 'van') {
    items = [...items, ...vanChecklistItems];
  }
  
  return items;
};
