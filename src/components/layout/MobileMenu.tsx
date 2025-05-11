
import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import NavLink from "./NavLink";
import { useAuth } from "@/context/AuthContext";

interface MobileMenuProps {
  isOpen: boolean;
  adminRoutes: { path: string; label: string }[];
}

const MobileMenu = ({ isOpen, adminRoutes }: MobileMenuProps) => {
  const [adminDropdownOpen, setAdminDropdownOpen] = useState(false);
  const { user, signOut, isAdmin, isStaff } = useAuth();
  
  const toggleAdminDropdown = () => setAdminDropdownOpen(!adminDropdownOpen);

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div
      className={cn(
        "fixed inset-0 bg-black z-40 transition-transform duration-300 transform md:hidden pt-20",
        isOpen ? "translate-x-0" : "translate-x-full"
      )}
    >
      <nav className="flex flex-col p-4">
        <NavLink to="/" isMobile>Home</NavLink>
        <NavLink to="/services" isMobile>Services</NavLink>
        <NavLink to="/gallery" isMobile>Gallery</NavLink>
        <NavLink to="/booking" isMobile>Book Now</NavLink>
        
        {(isAdmin || isStaff) && (
          <>
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
          </>
        )}
        
        {user ? (
          <button
            onClick={handleSignOut}
            className="mt-4 py-3 px-4 w-full text-lg text-white text-left border-t border-gray-800 pt-4"
          >
            Sign out ({user.email})
          </button>
        ) : (
          <Link
            to="/login"
            className="mt-4 gold-gradient px-4 py-3 rounded text-black font-medium text-center flex items-center justify-center"
            aria-label="Login"
          >
            Admin Login
          </Link>
        )}
      </nav>
    </div>
  );
};

export default MobileMenu;
