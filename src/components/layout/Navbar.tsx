
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ChevronDown, User, Lock, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

const NavLink = ({ 
  to, 
  children,
  isMobile = false,
  isDropdownItem = false
}: { 
  to: string; 
  children: React.ReactNode;
  isMobile?: boolean;
  isDropdownItem?: boolean;
}) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={cn(
        "relative transition-all duration-300 inline-block text-white",
        isMobile ? "py-3 px-4 w-full text-lg" : "px-4 py-2",
        isDropdownItem ? "hover:text-gold w-full text-left" : "hover:text-gold",
        isActive && "text-gold"
      )}
      aria-current={isActive ? "page" : undefined}
    >
      {children}
      <span className={cn(
        "absolute bottom-0 left-0 w-0 h-0.5 bg-gold transition-all duration-300",
        isActive ? "w-full" : "group-hover:w-full"
      )}></span>
    </Link>
  );
};

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [adminDropdownOpen, setAdminDropdownOpen] = useState(false);
  const location = useLocation();

  const handleToggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const closeMenu = () => setIsMenuOpen(false);

  const toggleAdminDropdown = () => setAdminDropdownOpen(!adminDropdownOpen);

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

        {/* Desktop Menu */}
        <nav className="hidden md:flex items-center space-x-1">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/packages">Packages</NavLink>
          <NavLink to="/booking">Booking</NavLink>
          <NavLink to="/gallery">Gallery</NavLink>
          <NavLink to="/progress">Track Progress</NavLink>
          
          <div className="relative group">
            <button 
              className={cn(
                "flex items-center space-x-1 px-4 py-2 text-white hover:text-gold focus:outline-none transition-colors",
                adminDropdownOpen ? "text-gold" : ""
              )}
              onClick={toggleAdminDropdown}
              aria-expanded={adminDropdownOpen}
              aria-label="Admin menu"
            >
              <span>Admin</span>
              <ChevronDown size={16} />
            </button>
            
            <div className={cn(
              "absolute right-0 mt-2 w-48 glass-morphism rounded-md shadow-lg overflow-hidden z-20 transition-all duration-300 origin-top-right",
              adminDropdownOpen 
                ? "opacity-100 transform scale-100 pointer-events-auto" 
                : "opacity-0 transform scale-95 pointer-events-none"
            )}>
              <div className="py-1 space-y-1">
                {adminRoutes.map((route) => (
                  <NavLink 
                    key={route.path} 
                    to={route.path}
                    isDropdownItem
                  >
                    {route.label}
                  </NavLink>
                ))}
              </div>
            </div>
          </div>
          
          <Link
            to="/login"
            className="ml-2 gold-gradient px-4 py-2 rounded text-black font-medium transition-all hover:shadow-lg hover:shadow-gold/20 focus:outline-none focus:ring-2 focus:ring-gold"
            aria-label="Login"
          >
            <User size={18} className="inline-block mr-2" />
            Login
          </Link>
        </nav>

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

      {/* Mobile Menu */}
      <div
        className={cn(
          "fixed inset-0 bg-black z-40 transition-transform duration-300 transform md:hidden pt-20",
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <nav className="flex flex-col p-4">
          <NavLink to="/" isMobile>Home</NavLink>
          <NavLink to="/packages" isMobile>Packages</NavLink>
          <NavLink to="/booking" isMobile>Booking</NavLink>
          <NavLink to="/gallery" isMobile>Gallery</NavLink>
          <NavLink to="/progress" isMobile>Track Progress</NavLink>
          
          <button
            className="text-left py-3 px-4 w-full text-lg text-white flex items-center justify-between"
            onClick={toggleAdminDropdown}
            aria-expanded={adminDropdownOpen}
          >
            <span>Admin</span>
            <ChevronDown size={16} className={cn(
              "transition-transform duration-200",
              adminDropdownOpen ? "rotate-180" : ""
            )} />
          </button>
          
          {adminDropdownOpen && (
            <div className="pl-4 space-y-1 border-l border-gold/30 ml-4">
              {adminRoutes.map((route) => (
                <NavLink key={route.path} to={route.path} isMobile>
                  {route.label}
                </NavLink>
              ))}
            </div>
          )}
          
          <Link
            to="/login"
            className="mt-4 gold-gradient px-4 py-3 rounded text-black font-medium text-center flex items-center justify-center"
            aria-label="Login"
          >
            <Lock size={18} className="mr-2" />
            Admin Login
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
