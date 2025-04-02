
import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import NavLink from "./NavLink";

interface MobileMenuProps {
  isOpen: boolean;
  adminRoutes: { path: string; label: string }[];
}

const MobileMenu = ({ isOpen, adminRoutes }: MobileMenuProps) => {
  const [adminDropdownOpen, setAdminDropdownOpen] = useState(false);
  
  const toggleAdminDropdown = () => setAdminDropdownOpen(!adminDropdownOpen);

  return (
    <div
      className={cn(
        "fixed inset-0 bg-black z-40 transition-transform duration-300 transform md:hidden pt-20",
        isOpen ? "translate-x-0" : "translate-x-full"
      )}
    >
      <nav className="flex flex-col p-4">
        <NavLink to="/" isMobile>Home</NavLink>
        <NavLink to="/packages" isMobile>Packages</NavLink>
        <NavLink to="/gallery" isMobile>Gallery</NavLink>
        
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
  );
};

export default MobileMenu;
