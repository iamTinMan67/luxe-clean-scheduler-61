
import { createBrowserRouter, Navigate } from 'react-router-dom';

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

// Import protected route
import ProtectedRoute from '@/components/auth/ProtectedRoute';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <ProtectedRoute element={<Index />} public />,
  },
  {
    path: '/services',
    element: <ProtectedRoute element={<ServicePackage />} public />,
  },
  {
    path: '/gallery',
    element: <ProtectedRoute element={<Gallery />} public />,
  },
  {
    path: '/booking',
    element: <ProtectedRoute element={<Booking />} public />,
  },
  {
    path: '/login',
    element: <ProtectedRoute element={<Login />} public />,
  },
  {
    path: '/track/:bookingId',
    element: <ProtectedRoute element={<TrackBooking />} public />,
  },
  {
    path: '/feedback/:bookingId',
    element: <ProtectedRoute element={<Feedback />} public />,
  },
  {
    path: '/progress/:bookingId',
    element: <ProtectedRoute element={<Progress />} public />,
  },
  {
    path: '/admin',
    element: <Navigate to="/admin/dashboard" replace />,
  },
  {
    path: '/admin/dashboard',
    element: <ProtectedRoute requiredRole="admin" element={<Dashboard />} />,
  },
  {
    path: '/admin/planner',
    element: <ProtectedRoute requiredRole="admin" element={<PlannerCalendar />} />,
  },
  {
    path: '/admin/staff-planner',
    element: <ProtectedRoute requiredRole="admin" element={<StaffPlanner />} />,
  },
  {
    path: '/admin/brochure',
    element: <ProtectedRoute requiredRole="admin" element={<Brochure />} />,
  },
  {
    path: '/admin/gallery',
    element: <ProtectedRoute requiredRole="admin" element={<GalleryManager />} />,
  },
  {
    path: '/admin/todo',
    element: <ProtectedRoute requiredRole="admin" element={<TodoList />} />,
  },
  {
    path: '/admin/invoices',
    element: <ProtectedRoute requiredRole="admin" element={<Invoices />} />,
  },
  {
    path: '/admin/invoice-report',
    element: <ProtectedRoute requiredRole="admin" element={<InvoiceReport />} />,
  },
  {
    path: '/admin/warehouse-inventory',
    element: <ProtectedRoute requiredRole="admin" element={<WarehouseInventory />} />,
  },
  {
    path: '/admin/van-inventory',
    element: <ProtectedRoute requiredRole="admin" element={<VanInventory />} />,
  },
  {
    path: '/admin/pre-inspection',
    element: <ProtectedRoute requiredRole="admin" element={<PreInspection />} />,
  },
  {
    path: '/admin/manage-packages',
    element: <ProtectedRoute requiredRole="admin" element={<ManagePackages />} />,
  },
  {
    path: '*',
    element: <NotFound />,
  },
]);
