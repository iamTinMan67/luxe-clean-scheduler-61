import { Navigate } from "react-router-dom";
import type { RouteObject } from "react-router-dom";
import { RouteLayout } from "./routeLayout";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

// Admin pages
import Dashboard from "@/pages/admin/Dashboard";
import BusinessDashboard from "@/pages/admin/BusinessDashboard";
import Daily from "@/pages/admin/Daily";
import Analytics from "@/pages/admin/Analytics";
import InvoiceReport from "@/pages/admin/InvoiceReport";
import PlannerCalendar from "@/pages/admin/PlannerCalendar";
import ManagePackages from "@/pages/admin/ManagePackages";
import ManageAdditionalServices from "@/pages/admin/ManageAdditionalServices";
import FeedbackManager from "@/pages/admin/FeedbackManager";
import GalleryManager from "@/pages/admin/GalleryManager";
import BrochurePage from "@/pages/admin/Brochure";
import VanInventory from "@/pages/admin/VanInventory";
import WarehouseInventory from "@/pages/admin/WarehouseInventory";
import Invoices from "@/pages/admin/Invoices";
import History from "@/pages/admin/History";
import FeedbackForm from "@/pages/admin/FeedbackForm";
import PreInspection from "@/pages/admin/PreInspection";
import DeclinedJobs from "@/pages/admin/DeclinedJobs";
import TodoList from "@/pages/admin/TodoList";
import ManualTaskGenerator from "@/pages/admin/ManualTaskGenerator";
import ManagementDashboard from "@/pages/admin/ManagementDashboard";
import PlanningDashboard from "@/pages/admin/PlanningDashboard";
import FeedbackDashboard from "@/pages/admin/FeedbackDashboard";
import InventoryDashboard from "@/pages/admin/InventoryDashboard";

// Helper function to wrap components with ProtectedRoute
const protectedComponent = (Component: React.ComponentType) => {
  return (
    <ProtectedRoute>
      <Component />
    </ProtectedRoute>
  );
};

const adminRoutes: RouteObject[] = [
  {
    path: "/",
    element: <RouteLayout />,
    children: [
      // Admin routes with redirect
      {
        path: "/admin",
        element: <Navigate to="/admin/dashboard" replace />,
      },
      {
        path: "/admin/dashboard",
        element: protectedComponent(Dashboard),
      },
      {
        path: "/admin/business-dashboard",
        element: protectedComponent(BusinessDashboard),
      },
      {
        path: "/admin/daily",
        element: protectedComponent(Daily),
      },
      {
        path: "/admin/planning",
        element: protectedComponent(PlanningDashboard),
      },
      {
        path: "/admin/management",
        element: protectedComponent(ManagementDashboard),
      },
      {
        path: "/admin/feedback",
        element: protectedComponent(FeedbackDashboard),
      },
      {
        path: "/admin/inventory",
        element: protectedComponent(InventoryDashboard),
      },
      {
        path: "/admin/analytics",
        element: protectedComponent(Analytics),
      },
      {
        path: "/admin/invoice-report",
        element: protectedComponent(InvoiceReport),
      },
      {
        path: "/admin/planner-calendar",
        element: protectedComponent(PlannerCalendar),
      },
      {
        path: "/admin/manage-packages",
        element: protectedComponent(ManagePackages),
      },
      {
        path: "/admin/manage-additional-services",
        element: protectedComponent(ManageAdditionalServices),
      },
      {
        path: "/admin/feedback-manager",
        element: protectedComponent(FeedbackManager),
      },
      {
        path: "/admin/gallery-manager",
        element: protectedComponent(GalleryManager),
      },
      {
        path: "/admin/brochure",
        element: protectedComponent(BrochurePage),
      },
      {
        path: "/admin/van-inventory",
        element: protectedComponent(VanInventory),
      },
      {
        path: "/admin/warehouse-inventory",
        element: protectedComponent(WarehouseInventory),
      },
      {
        path: "/admin/invoices",
        element: protectedComponent(Invoices),
      },
      {
        path: "/admin/history",
        element: protectedComponent(History),
      },
      {
        path: "/admin/feedback-form",
        element: protectedComponent(FeedbackForm),
      },
      {
        path: "/admin/pre-inspection",
        element: protectedComponent(PreInspection),
      },
      {
        path: "/admin/declined-jobs",
        element: protectedComponent(DeclinedJobs),
      },
      {
        path: "/admin/todo-list",
        element: protectedComponent(TodoList),
      },
      {
        path: "/admin/manual-task-generator",
        element: protectedComponent(ManualTaskGenerator),
      },
    ],
  },
];

export default adminRoutes;
