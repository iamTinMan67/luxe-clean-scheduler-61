
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import BubbleEffect from "@/components/ui/BubbleEffect";
import { useLocation } from "react-router-dom";

const Layout = () => {
  const location = useLocation();
  
  // Only show footer on services and bookings pages
  const shouldShowFooter = [
    '/services',
    '/booking'
  ].includes(location.pathname);

  // Hide footer on all admin pages
  const isAdminPage = location.pathname.startsWith('/admin');

  return (
    <div className="flex flex-col min-h-screen relative">
      <BubbleEffect />
      <Navbar />
      <main className="flex-1 relative z-10">
        <Outlet />
      </main>
      {(shouldShowFooter && !isAdminPage) && <Footer />}
    </div>
  );
};

export default Layout;
