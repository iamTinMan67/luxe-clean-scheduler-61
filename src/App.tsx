
import { Routes, Route, BrowserRouter } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import Index from "@/pages/Index";
import ServicePackage from "@/pages/ServicePackage";
import Booking from "@/pages/Booking";
import Progress from "@/pages/Progress";
import Gallery from "@/pages/Gallery";
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

function App() {
  return (
    <div>
      <BrowserRouter>
        <BubbleEffect /> {/* Added BubbleEffect here so it appears on all pages */}
        <Navbar />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/services" element={<ServicePackage />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/progress" element={<Progress />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/feedback/:invoiceId" element={<Feedback />} />
          
          {/* Admin Routes */}
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/admin/planner" element={<PlannerCalendar />} />
          <Route path="/admin/pre-inspection" element={<PreInspection />} />
          <Route path="/admin/van-inventory" element={<VanInventory />} />
          <Route path="/admin/warehouse-inventory" element={<WarehouseInventory />} />
          <Route path="/admin/staff-planner" element={<StaffPlanner />} />
          <Route path="/admin/todo-list" element={<TodoList />} />
          <Route path="/admin/invoice-report" element={<InvoiceReport />} />
          <Route path="/admin/invoices" element={<Invoices />} />
          <Route path="/admin/gallery" element={<GalleryManager />} />
          <Route path="/admin/manage-packages" element={<ManagePackages />} />
          <Route path="/admin/brochure" element={<Brochure />} />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
      <Toaster />
    </div>
  );
}

export default App;
