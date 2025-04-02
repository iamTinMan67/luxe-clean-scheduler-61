
import { useState } from "react";
import { Link } from "react-router-dom";
import { User } from "lucide-react";
import NavLink from "./NavLink";
import AdminDropdown from "./AdminDropdown";

interface DesktopMenuProps {
  adminRoutes: { path: string; label: string }[];
}

const DesktopMenu = ({ adminRoutes }: DesktopMenuProps) => {
  const [adminDropdownOpen, setAdminDropdownOpen] = useState(false);
  
  const toggleAdminDropdown = () => setAdminDropdownOpen(!adminDropdownOpen);

  return (
    <nav className="hidden md:flex items-center space-x-1">
      <NavLink to="/">Home</NavLink>
      <NavLink to="/gallery">Gallery</NavLink>
      
      <AdminDropdown 
        adminRoutes={adminRoutes} 
        isOpen={adminDropdownOpen} 
        toggle={toggleAdminDropdown} 
      />
      
      <Link
        to="/login"
        className="ml-2 gold-gradient px-4 py-2 rounded text-black font-medium transition-all hover:shadow-lg hover:shadow-gold/20 focus:outline-none focus:ring-2 focus:ring-gold"
        aria-label="Login"
      >
        <User size={18} className="inline-block mr-2" />
        Login
      </Link>
    </nav>
  );
};

export default DesktopMenu;
