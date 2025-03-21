
import { Routes, Route, BrowserRouter } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import Index from "@/pages/Index";
import ServicePackage from "@/pages/ServicePackage";
import Booking from "@/pages/Booking";
import Progress from "@/pages/Progress";
import Gallery from "@/pages/Gallery";
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
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

function App() {
  return (
    <div>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/services" element={<ServicePackage />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/progress" element={<Progress />} />
          <Route path="/gallery" element={<Gallery />} />
          
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
          
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />
      </BrowserRouter>
      <Toaster />
    </div>
  );
}

export default App;
