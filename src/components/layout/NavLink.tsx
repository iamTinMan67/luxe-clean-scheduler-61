
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

interface NavLinkProps { 
  to: string; 
  children: React.ReactNode;
  isMobile?: boolean;
  isDropdownItem?: boolean;
}

const NavLink = ({ 
  to, 
  children,
  isMobile = false,
  isDropdownItem = false
}: NavLinkProps) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={cn(
        "relative transition-all duration-300 inline-block text-yellow-400",
        isMobile ? "py-3 px-4 w-full text-lg" : "px-4 py-2",
        isDropdownItem ? "hover:text-yellow-300 w-full text-left" : "hover:text-yellow-300",
        isActive && "text-yellow-300"
      )}
      aria-current={isActive ? "page" : undefined}
    >
      {children}
      <span className={cn(
        "absolute bottom-0 left-0 w-0 h-0.5 bg-yellow-400 transition-all duration-300",
        isActive ? "w-full" : "group-hover:w-full"
      )}></span>
    </Link>
  );
};

export default NavLink;
