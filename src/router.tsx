import { createBrowserRouter, Navigate } from 'react-router-dom';

// Import layout
import Layout from '@/components/layout/Layout';

// Import pages
import Index from '@/pages/Index';
import NotFound from '@/pages/NotFound';
import ServicePackage from '@/pages/ServicePackage';
import Gallery from '@/pages/Gallery';
import Booking from '@/pages/Booking';
import Login from '@/pages/Login';
import TrackBooking from '@/pages/TrackBooking';
import Feedback from '@/pages/Feedback';
import Progress from '@/pages/Progress';

// Admin Pages
import Dashboard from '@/pages/admin/Dashboard';
import PlannerCalendar from '@/pages/admin/PlannerCalendar';
import StaffPlanner from '@/pages/admin/StaffPlanner';
import Brochure from '@/pages/admin/Brochure';
import GalleryManager from '@/pages/admin/GalleryManager';
import TodoList from '@/pages/admin/TodoList';
import Invoices from '@/pages/admin/Invoices';
import InvoiceReport from '@/pages/admin/InvoiceReport';
import WarehouseInventory from '@/pages/admin/WarehouseInventory';
import VanInventory from '@/pages/admin/VanInventory';
import PreInspection from '@/pages/admin/PreInspection';
import ManagePackages from '@/pages/admin/ManagePackages';
import FeedbackManager from '@/pages/admin/FeedbackManager';

// Import protected route
import ProtectedRoute from '@/components/auth/ProtectedRoute';

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <Index />,
      },
      {
        path: '/services',
        element: <ServicePackage />,
      },
      {
        path: '/gallery',
        element: <Gallery />,
      },
      {
        path: '/booking',
        element: <Booking />,
      },
      {
        path: '/login',
        element: <Login />,
      },
      {
        path: '/track/:bookingId',
        element: <TrackBooking />,
      },
      {
        path: '/feedback/:bookingId',
        element: <Feedback />,
      },
      {
        path: '/progress/:bookingId',
        element: <Progress />,
      },
      {
        path: '/admin',
        element: <Navigate to="/admin/dashboard" replace />,
      },
      {
        path: '/admin/dashboard',
        element: <ProtectedRoute requireAdmin element={<Dashboard />} />,
      },
      {
        path: '/admin/planner',
        element: <ProtectedRoute requireAdmin element={<PlannerCalendar />} />,
      },
      {
        path: '/admin/staff-planner',
        element: <ProtectedRoute requireAdmin element={<StaffPlanner />} />,
      },
      {
        path: '/admin/brochure',
        element: <ProtectedRoute requireAdmin element={<Brochure />} />,
      },
      {
        path: '/admin/gallery',
        element: <ProtectedRoute requireAdmin element={<GalleryManager />} />,
      },
      {
        path: '/admin/todo',
        element: <ProtectedRoute requireAdmin element={<TodoList />} />,
      },
      {
        path: '/admin/invoices',
        element: <ProtectedRoute requireAdmin element={<Invoices />} />,
      },
      {
        path: '/admin/invoice-report',
        element: <ProtectedRoute requireAdmin element={<InvoiceReport />} />,
      },
      {
        path: '/admin/warehouse-inventory',
        element: <ProtectedRoute requireAdmin element={<WarehouseInventory />} />,
      },
      {
        path: '/admin/van-inventory',
        element: <ProtectedRoute requireAdmin element={<VanInventory />} />,
      },
      {
        path: '/admin/pre-inspection',
        element: <ProtectedRoute requireAdmin element={<PreInspection />} />,
      },
      {
        path: '/admin/manage-packages',
        element: <ProtectedRoute requireAdmin element={<ManagePackages />} />,
      },
      // Add new feedback manager route
      {
        path: '/admin/feedback',
        element: <ProtectedRoute requireAdmin element={<FeedbackManager />} />,
      },
      {
        path: '*',
        element: <NotFound />,
      }
    ]
  }
]);
