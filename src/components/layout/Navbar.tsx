
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
    { path: "/admin/staff", label: "Staff Planner" },
    { path: "/admin/inspection", label: "Pre-Inspection" },
    { path: "/admin/van-inventory", label: "Van Stock" },
    { path: "/admin/inventory", label: "Inventory" },
    { path: "/admin/invoices", label: "Invoices" },
    { path: "/admin/todos", label: "To-do List" },
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
        <Link to="/" className="flex items-center space-x-2" aria-label="Home">
          <span className="text-white font-bold text-2xl">Mid Cheshire Valeting</span>
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
