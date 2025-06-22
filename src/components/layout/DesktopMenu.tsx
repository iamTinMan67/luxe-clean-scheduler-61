
import NavLink from "./NavLink";
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
  const { user } = useAuth();

  return (
    <nav className="hidden md:flex items-center space-x-1">
      <NavLink to="/">Home</NavLink>
      <NavLink to="/gallery">Gallery</NavLink>
      
      {user && (
        <NavLink to="/admin/dashboard">Dashboard</NavLink>
      )}
      
      <UserMenu />
    </nav>
  );
};

export default DesktopMenu;
