
// Types for van inventory management
export type InventoryItem = {
  id: string;
  name: string;
  category: string;
  quantity: number;
  minLevel: number;
  lastRestocked: string;
  vanId: string;
};

export type Van = {
  id: string;
  registration: string;
  name: string;
};

// Form schema exports will be handled by the hooks
