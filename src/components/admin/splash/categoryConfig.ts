
import { 
  BarChart3,
  Calendar,
  Settings,
  MessageSquare,
  Package
} from "lucide-react";
import { CategoryConfig } from "./types";

export const categoryConfig: Record<string, CategoryConfig> = {
  analytics: {
    title: 'Analytics & Insights',
    icon: BarChart3,
    color: 'gold',
    featured: true
  },
  planning: {
    title: 'Planning & Scheduling',
    icon: Calendar,
    color: 'blue'
  },
  management: {
    title: 'Business Management', 
    icon: Settings,
    color: 'green'
  },
  feedback: {
    title: 'Customer Feedback',
    icon: MessageSquare,
    color: 'purple'
  },
  inventory: {
    title: 'Inventory Management',
    icon: Package,
    color: 'orange'
  }
};
