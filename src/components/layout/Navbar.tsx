
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import DesktopMenu from "./DesktopMenu";
import MobileMenu from "./MobileMenu";
import ContactInfo from "./ContactInfo";

interface AdminRoute {
  path: string;
  label: string;
  subRoutes?: AdminRoute[];
}

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  
  // Function to check if current page is admin-related
  const isAdminRelatedPage = () => {
    const path = location.pathname;
    return path.startsWith('/admin') || 
           path.startsWith('/management') || 
           path === '/feedback/new';
  };

  const handleToggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleContact = () => setShowContact(!showContact);

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
    { path: "/admin/todo", label: "To-do List" },
    { 
      label: "Management",
      path: "#",
      subRoutes: [
        { path: "/management/invoices", label: "Invoices" },
        { path: "/management/history", label: "History" },
        { path: "/management/brochure", label: "Brochure" },
        { path: "/management/packages", label: "Manage Packages" },
        { path: "/management/gallery", label: "Gallery Manager" },
        { path: "/management/van-inventory", label: "Van Inventory" },
        { path: "/management/warehouse-inventory", label: "Warehouse Inventory" }
      ]
    },
    { 
      label: "Feedback",
      path: "#",
      subRoutes: [
        { path: "/feedback/new", label: "Feedback Form" },
        { path: "/admin/feedback", label: "Feedback Manager" }
      ]
    },
  ];

  return (
    <header
      className={cn(
        "fixed top-0 left-0 w-full z-50 transition-all duration-300",
        scrolled ? "bg-black/90 backdrop-blur-md py-2 shadow-md" : "bg-transparent py-4"
      )}
    >
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
        {/* Logo and Contact Section */}
        <div className="flex flex-col">
          <Link to="/" className="flex items-center space-x-2" aria-label="Home">
            <img 
              src="/lovable-uploads/20bcd8db-4042-4d14-9238-3fe36de9757f.png" 
              alt="Mid-Cheshire Mobile Valeting" 
              className="h-20 w-auto" 
            />
          </Link>
          
          {/* Quick Contact - Hide on Admin-related pages */}
          {!isAdminRelatedPage() && (
            <div className="hidden md:block mt-1">
              <button 
                onClick={toggleContact}
                className="text-gold hover:text-white text-sm flex items-center transition-colors"
              >
                Contact Us {showContact ? '▲' : '▼'}
              </button>
              
              {showContact && (
                <div className="absolute bg-black/90 p-3 rounded-md shadow-lg border border-gold/20 mt-1">
                  <ContactInfo />
                </div>
              )}
            </div>
          )}
        </div>
        
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

      <MobileMenu isOpen={isMenuOpen} adminRoutes={adminRoutes} isAdminPage={isAdminRelatedPage()} />
    </header>
  );
};

export default Navbar;
