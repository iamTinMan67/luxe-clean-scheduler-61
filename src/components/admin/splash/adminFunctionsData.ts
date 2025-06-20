
import { 
  Calendar, 
  FileText, 
  ClipboardList, 
  MessageSquare, 
  DollarSign, 
  Package, 
  Camera, 
  Truck,
  Warehouse,
  BarChart3,
  CheckSquare,
  Star
} from "lucide-react";
import { AdminFunction } from "./types";

export const adminFunctions: AdminFunction[] = [
  // Analytics (Featured)
  {
    id: 'analytics',
    title: 'Business Analytics',
    description: 'Performance metrics and insights',
    icon: BarChart3,
    path: '/admin/analytics',
    category: 'analytics'
  },

  // Planning & Scheduling
  {
    id: 'planner',
    title: 'Planner Calendar',
    description: 'Schedule and manage appointments',
    icon: Calendar,
    path: '/admin/planner-calendar',
    category: 'planning'
  },
  {
    id: 'pre-inspection',
    title: 'Pre-Inspection',
    description: 'Vehicle condition assessments',
    icon: CheckSquare,
    path: '/admin/pre-inspection',
    category: 'planning'
  },
  {
    id: 'todo',
    title: 'To-do List',
    description: 'Task management and tracking',
    icon: ClipboardList,
    path: '/admin/todo-list',
    category: 'planning'
  },

  // Business Management
  {
    id: 'invoices',
    title: 'Invoices',
    description: 'Billing and payment management',
    icon: DollarSign,
    path: '/admin/invoices',
    category: 'management'
  },
  {
    id: 'history',
    title: 'History',
    description: 'Past bookings and records',
    icon: FileText,
    path: '/admin/history',
    category: 'management'
  },
  {
    id: 'packages',
    title: 'Manage Packages',
    description: 'Service package configuration',
    icon: Package,
    path: '/admin/manage-packages',
    category: 'management'
  },
  {
    id: 'brochure',
    title: 'Brochure',
    description: 'Marketing materials',
    icon: FileText,
    path: '/admin/brochure',
    category: 'management'
  },
  {
    id: 'gallery',
    title: 'Gallery Manager',
    description: 'Photo and media management',
    icon: Camera,
    path: '/admin/gallery-manager',
    category: 'management'
  },

  // Customer Feedback
  {
    id: 'feedback-form',
    title: 'Feedback Form',
    description: 'Customer feedback collection',
    icon: MessageSquare,
    path: '/admin/feedback-form',
    category: 'feedback'
  },
  {
    id: 'feedback-manager',
    title: 'Feedback Manager',
    description: 'Review and respond to feedback',
    icon: Star,
    path: '/admin/feedback-manager',
    category: 'feedback'
  },

  // Inventory Management
  {
    id: 'van-inventory',
    title: 'Van Inventory',
    description: 'Mobile equipment tracking',
    icon: Truck,
    path: '/admin/van-inventory',
    category: 'inventory'
  },
  {
    id: 'warehouse-inventory',
    title: 'Warehouse Inventory',
    description: 'Storage and supplies management',
    icon: Warehouse,
    path: '/admin/warehouse-inventory',
    category: 'inventory'
  }
];
