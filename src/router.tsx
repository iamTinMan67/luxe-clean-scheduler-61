import { createBrowserRouter, Navigate } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Index from "./pages/Index";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import Booking from "./pages/Booking";
import ServicePackage from "./pages/ServicePackage";
import Feedback from "./pages/Feedback";
import Gallery from "./pages/Gallery";
import Dashboard from "./pages/admin/Dashboard";
import InvoiceReport from "./pages/admin/InvoiceReport";
import PlannerCalendar from "./pages/admin/PlannerCalendar";
import ManagePackages from "./pages/admin/ManagePackages";
import ManageAdditionalServices from "./pages/admin/ManageAdditionalServices";
import FeedbackManager from "./pages/admin/FeedbackManager";
import GalleryManager from "./pages/admin/GalleryManager";
import BrochurePage from "./pages/admin/Brochure";
import VanInventory from "./pages/admin/VanInventory";
import WarehouseInventory from "./pages/admin/WarehouseInventory";
import Invoices from "./pages/admin/Invoices";
import History from "./pages/admin/History";
import FeedbackForm from "./pages/admin/FeedbackForm";
import PreInspection from "./pages/admin/PreInspection";
import DeclinedJobs from "./pages/admin/DeclinedJobs";
import TodoList from "./pages/admin/TodoList";
import Progress from "./pages/Progress";
import TrackBooking from "./pages/TrackBooking";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import DataMigration from "@/components/DataMigration";
import DataMigrationTrigger from "@/components/DataMigrationTrigger";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <>
        <DataMigrationTrigger />
        <Layout />
      </>
    ),
    errorElement: <NotFound />,
    children: [
      {
        path: "/",
        element: <Index />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/booking",
        element: <Booking />,
      },
      {
        path: "/services",
        element: <ServicePackage />,
      },
      {
        path: "/feedback",
        element: <Feedback />,
      },
      {
        path: "/gallery",
        element: <Gallery />,
      },
      {
        path: "/progress",
        element: <Progress />,
      },
      // New route for TrackBooking without bookingId
      {
        path: "/track",
        element: <TrackBooking />,
      },
      // Route for TrackBooking with bookingId
      {
        path: "/track/:bookingId",
        element: <TrackBooking />,
      },
      // Admin routes
      {
        path: "/admin",
        element: <Navigate to="/admin/dashboard" replace />,
      },
      {
        path: "/admin/dashboard",
        element: (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "/admin/invoice-report",
        element: (
          <ProtectedRoute>
            <InvoiceReport />
          </ProtectedRoute>
        ),
      },
      {
        path: "/admin/planner-calendar",
        element: (
          <ProtectedRoute>
            <PlannerCalendar />
          </ProtectedRoute>
        ),
      },
      {
        path: "/admin/manage-packages",
        element: (
          <ProtectedRoute>
            <ManagePackages />
          </ProtectedRoute>
        ),
      },
      {
        path: "/admin/manage-additional-services",
        element: (
          <ProtectedRoute>
            <ManageAdditionalServices />
          </ProtectedRoute>
        ),
      },
      {
        path: "/admin/feedback-manager",
        element: (
          <ProtectedRoute>
            <FeedbackManager />
          </ProtectedRoute>
        ),
      },
      {
        path: "/admin/gallery-manager",
        element: (
          <ProtectedRoute>
            <GalleryManager />
          </ProtectedRoute>
        ),
      },
      {
        path: "/admin/brochure",
        element: (
          <ProtectedRoute>
            <BrochurePage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/admin/van-inventory",
        element: (
          <ProtectedRoute>
            <VanInventory />
          </ProtectedRoute>
        ),
      },
      {
        path: "/admin/warehouse-inventory",
        element: (
          <ProtectedRoute>
            <WarehouseInventory />
          </ProtectedRoute>
        ),
      },
      {
        path: "/admin/invoices",
        element: (
          <ProtectedRoute>
            <Invoices />
          </ProtectedRoute>
        ),
      },
      {
        path: "/admin/history",
        element: (
          <ProtectedRoute>
            <History />
          </ProtectedRoute>
        ),
      },
      {
        path: "/admin/feedback-form",
        element: (
          <ProtectedRoute>
            <FeedbackForm />
          </ProtectedRoute>
        ),
      },
      {
        path: "/admin/pre-inspection",
        element: (
          <ProtectedRoute>
            <PreInspection />
          </ProtectedRoute>
        ),
      },
      {
        path: "/admin/declined-jobs",
        element: (
          <ProtectedRoute>
            <DeclinedJobs />
          </ProtectedRoute>
        ),
      },
      {
        path: "/admin/todo-list",
        element: (
          <ProtectedRoute>
            <TodoList />
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: "/data-migration",
    element: <DataMigration />,
  },
]);

export default router;
