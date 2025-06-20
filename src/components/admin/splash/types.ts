
import { LucideIcon } from "lucide-react";

export interface AdminFunction {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  path: string;
  category: 'planning' | 'management' | 'feedback' | 'inventory' | 'analytics';
}

export interface CategoryConfig {
  title: string;
  icon: LucideIcon;
  color: string;
  featured?: boolean;
}
