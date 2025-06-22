
import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import NavLink from "./NavLink";
import { useAuth } from "@/context/AuthContext";
import ContactInfo from "./ContactInfo";

interface AdminRoute {
  path: string;
  label: string;
  subRoutes?: AdminRoute[];
}

interface MobileMenuProps {
  isOpen: boolean;
  adminRoutes: AdminRoute[];
  isAdminPage: boolean;
}

const MobileMenu = ({ isOpen, adminRoutes, isAdminPage }: MobileMenuProps) => {
  const [contactDropdownOpen, setContactDropdownOpen] = useState(false);
  const { user, signOut } = useAuth();
  
  const toggleContactDropdown = () => setContactDropdownOpen(!contactDropdownOpen);

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
        <NavLink to="/gallery" isMobile>Gallery</NavLink>
        
        {user && (
          <NavLink to="/admin/dashboard" isMobile>Dashboard</NavLink>
        )}
        
        {/* Contact Us Dropdown - Hide on Admin Pages */}
        {!isAdminPage && (
          <>
            <button
              className="text-left py-3 px-4 w-full text-lg text-white flex items-center justify-between"
              onClick={toggleContactDropdown}
              aria-expanded={contactDropdownOpen}
            >
              <span>Contact Us</span>
              <ChevronDown size={16} className={cn(
                "transition-transform duration-200",
                contactDropdownOpen ? "rotate-180" : ""
              )} />
            </button>
            
            {contactDropdownOpen && (
              <div className="pl-4 space-y-3 border-l border-gold/30 ml-4 py-3">
                <ContactInfo />
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
