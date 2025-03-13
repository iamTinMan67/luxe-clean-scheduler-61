import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

// Layouts
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";

// Public Pages
import Index from "./pages/Index";
import ServicePackage from "./pages/ServicePackage";
import Booking from "./pages/Booking";
import Gallery from "./pages/Gallery";
import Progress from "./pages/Progress";

// Admin Pages
import Dashboard from "./pages/admin/Dashboard";
import PlannerCalendar from "./pages/admin/PlannerCalendar";
import StaffPlanner from "./pages/admin/StaffPlanner";
import PreInspection from "./pages/admin/PreInspection";
import VanInventory from "./pages/admin/VanInventory";
import WarehouseInventory from "./pages/admin/WarehouseInventory";
import InvoiceReport from "./pages/admin/InvoiceReport";
import TodoList from "./pages/admin/TodoList";

// Other Pages
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="flex flex-col min-h-screen bg-background">
          <Navbar />
          <main className="flex-grow pt-20">
            <AnimatePresence mode="wait">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Index />} />
                <Route path="/services" element={<ServicePackage />} />
                <Route path="/booking" element={<Booking />} />
                <Route path="/gallery" element={<Gallery />} />
                <Route path="/progress" element={<Progress />} />
                
                {/* Admin Routes */}
                <Route path="/admin/dashboard" element={<Dashboard />} />
                <Route path="/admin/planner" element={<PlannerCalendar />} />
                <Route path="/admin/staff" element={<StaffPlanner />} />
                <Route path="/admin/inspection" element={<PreInspection />} />
                <Route path="/admin/van-inventory" element={<VanInventory />} />
                <Route path="/admin/warehouse" element={<WarehouseInventory />} />
                <Route path="/admin/invoices" element={<InvoiceReport />} />
                <Route path="/admin/todos" element={<TodoList />} />
                
                {/* Catch-all */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </AnimatePresence>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
