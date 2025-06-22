
import NavLink from "./NavLink";
import UserMenu from "./UserMenu";

interface AdminRoute {
  path: string;
  label: string;
  subRoutes?: AdminRoute[];
}

interface DesktopMenuProps {
  adminRoutes: AdminRoute[];
}

const DesktopMenu = ({ adminRoutes }: DesktopMenuProps) => {
  return (
    <nav className="hidden md:flex items-center space-x-1">
      <NavLink to="/">Home</NavLink>
      <NavLink to="/gallery">Gallery</NavLink>
      
      <UserMenu />
    </nav>
  );
};

export default DesktopMenu;
