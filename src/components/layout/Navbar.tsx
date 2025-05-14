import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import DesktopMenu from "./DesktopMenu";
import MobileMenu from "./MobileMenu";

interface AdminRoute {
  path: string;
  label: string;
  subRoutes?: AdminRoute[];
}

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  const handleToggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const closeMenu = () => setIsMenuOpen(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    closeMenu();
  }, [location]);

  const adminRoutes: AdminRoute[] = [
    { path: "/admin/dashboard", label: "Dashboard" },
    { path: "/admin/planner", label: "Planners" },
    { path: "/admin/pre-inspection", label: "Pre-Inspection" },
    { path: "/admin/van-inventory", label: "Van Stock" },
    { path: "/admin/warehouse-inventory", label: "Warehouse Inventory" },
    { path: "/admin/manage-packages", label: "Manage Packages" },
    { path: "/admin/todo", label: "To-do List" },
    { path: "/admin/invoices", label: "Invoices" },
    { 
      label: "Feedback",
      path: "#",
      subRoutes: [
        { path: "/feedback/new", label: "Feedback Form" },
        { path: "/admin/feedback", label: "Feedback Manager" }
      ]
    },
    { path: "/admin/gallery", label: "Gallery Manager" },
    { path: "/admin/brochure", label: "Brochure" },
  ];

  return (
    <header
      className={cn(
        "fixed top-0 left-0 w-full z-50 transition-all duration-300",
        scrolled ? "bg-black/90 backdrop-blur-md py-2 shadow-md" : "bg-transparent py-4"
      )}
    >
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
        {/* Logo - Now showing on all pages */}
        <Link to="/" className="flex items-center space-x-2" aria-label="Home">
          <img 
            src="/lovable-uploads/20bcd8db-4042-4d14-9238-3fe36de9757f.png" 
            alt="Mid-Cheshire Mobile Valeting" 
            className="h-20 w-auto" 
          />
        </Link>
        
        <DesktopMenu adminRoutes={adminRoutes} />

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white flex items-center"
          onClick={handleToggleMenu}
          aria-expanded={isMenuOpen}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <MobileMenu isOpen={isMenuOpen} adminRoutes={adminRoutes} />
    </header>
  );
};

export default Navbar;
