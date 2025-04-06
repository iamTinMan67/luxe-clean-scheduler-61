
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import DesktopMenu from "./DesktopMenu";
import MobileMenu from "./MobileMenu";

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

  const adminRoutes = [
    { path: "/admin/dashboard", label: "Dashboard" },
    { path: "/admin/planner", label: "Planner Calendar" },
    { path: "/admin/staff-planner", label: "Staff Planner" },
    { path: "/admin/pre-inspection", label: "Pre-Inspection" },
    { path: "/admin/van-inventory", label: "Van Stock" },
    { path: "/admin/warehouse-inventory", label: "Warehouse Inventory" },
    { path: "/admin/todo-list", label: "To-do List" },
    { path: "/admin/invoices", label: "Invoices" },
    { path: "/admin/gallery", label: "Gallery Manager" },
    { path: "/progress", label: "Track Progress" },
  ];

  return (
    <header
      className={cn(
        "fixed top-0 left-0 w-full z-50 transition-all duration-300",
        scrolled ? "bg-black/90 backdrop-blur-md py-2 shadow-md" : "bg-transparent py-4"
      )}
    >
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
        {!isHomePage && (
          <Link to="/" className="flex items-center space-x-2" aria-label="Home">
            <img 
              src="/lovable-uploads/db88bc12-bb88-4318-a91c-da8a3314c406.png" 
              alt="Mid-Cheshire Valeting" 
              className="h-14 w-auto" 
            />
          </Link>
        )}
        
        {isHomePage && <div className="w-14"></div>}

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
