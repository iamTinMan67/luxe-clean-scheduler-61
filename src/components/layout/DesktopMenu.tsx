
import { useState } from "react";
import NavLink from "./NavLink";
import AdminDropdown from "./AdminDropdown";
import UserMenu from "./UserMenu";
import { useAuth } from "@/context/AuthContext";

interface AdminRoute {
  path: string;
  label: string;
  subRoutes?: AdminRoute[];
}

interface DesktopMenuProps {
  adminRoutes: AdminRoute[];
}

const DesktopMenu = ({ adminRoutes }: DesktopMenuProps) => {
  const [adminDropdownOpen, setAdminDropdownOpen] = useState(false);
  const { isAdmin, isStaff } = useAuth();
  
  const toggleAdminDropdown = () => setAdminDropdownOpen(!adminDropdownOpen);

  return (
    <nav className="hidden md:flex items-center space-x-1">
      <NavLink to="/">Home</NavLink>
      <NavLink to="/gallery">Gallery</NavLink>
      
      {(isAdmin || isStaff) && (
        <AdminDropdown 
          adminRoutes={adminRoutes} 
          isOpen={adminDropdownOpen} 
          toggle={toggleAdminDropdown} 
        />
      )}
      
      <UserMenu />
    </nav>
  );
};

export default DesktopMenu;
