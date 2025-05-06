
import { Routes, Route, BrowserRouter } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/context/AuthContext";
import Index from "@/pages/Index";
import ServicePackage from "@/pages/ServicePackage";
import Booking from "@/pages/Booking";
import Progress from "@/pages/Progress";
import TrackBooking from "@/pages/TrackBooking";
import Gallery from "@/pages/Gallery";
import Login from "@/pages/Login";
import Feedback from "@/pages/Feedback";
import NotFound from "@/pages/NotFound";
import PlannerCalendar from "@/pages/admin/PlannerCalendar";
import Dashboard from "@/pages/admin/Dashboard";
import PreInspection from "@/pages/admin/PreInspection";
import VanInventory from "@/pages/admin/VanInventory";
import WarehouseInventory from "@/pages/admin/WarehouseInventory";
import StaffPlanner from "@/pages/admin/StaffPlanner";
import TodoList from "@/pages/admin/TodoList";
import InvoiceReport from "@/pages/admin/InvoiceReport";
import Invoices from "@/pages/admin/Invoices";
import GalleryManager from "@/pages/admin/GalleryManager";
import ManagePackages from "@/pages/admin/ManagePackages";
import Brochure from "@/pages/admin/Brochure";
import Navbar from "@/components/layout/Navbar";
import BubbleEffect from "@/components/effects/BubbleEffect";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <BubbleEffect />
        <Navbar />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/services" element={<ServicePackage />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/progress" element={<Progress />} />
          <Route path="/track" element={<TrackBooking />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/login" element={<Login />} />
          <Route path="/feedback/:invoiceId" element={<Feedback />} />
          
          {/* Admin Routes - Protected by role */}
          <Route path="/admin/dashboard" element={
            <ProtectedRoute requireStaff>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin/planner" element={
            <ProtectedRoute requireStaff>
              <PlannerCalendar />
            </ProtectedRoute>
          } />
          <Route path="/admin/pre-inspection" element={
            <ProtectedRoute requireStaff>
              <PreInspection />
            </ProtectedRoute>
          } />
          <Route path="/admin/van-inventory" element={
            <ProtectedRoute requireStaff>
              <VanInventory />
            </ProtectedRoute>
          } />
          <Route path="/admin/warehouse-inventory" element={
            <ProtectedRoute requireStaff>
              <WarehouseInventory />
            </ProtectedRoute>
          } />
          <Route path="/admin/staff-planner" element={
            <ProtectedRoute requireStaff>
              <StaffPlanner />
            </ProtectedRoute>
          } />
          <Route path="/admin/todo-list" element={
            <ProtectedRoute requireStaff>
              <TodoList />
            </ProtectedRoute>
          } />
          <Route path="/admin/invoice-report" element={
            <ProtectedRoute requireStaff>
              <InvoiceReport />
            </ProtectedRoute>
          } />
          <Route path="/admin/invoices" element={
            <ProtectedRoute requireStaff>
              <Invoices />
            </ProtectedRoute>
          } />
          <Route path="/admin/gallery" element={
            <ProtectedRoute requireStaff>
              <GalleryManager />
            </ProtectedRoute>
          } />
          <Route path="/admin/manage-packages" element={
            <ProtectedRoute requireStaff>
              <ManagePackages />
            </ProtectedRoute>
          } />
          <Route path="/admin/brochure" element={
            <ProtectedRoute requireStaff>
              <Brochure />
            </ProtectedRoute>
          } />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
      <Toaster />
    </AuthProvider>
  );
}

export default App;
