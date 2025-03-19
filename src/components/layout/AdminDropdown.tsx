
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import NavLink from "./NavLink";

interface AdminDropdownProps {
  adminRoutes: { path: string; label: string }[];
  isOpen: boolean;
  toggle: () => void;
}

const AdminDropdown = ({ adminRoutes, isOpen, toggle }: AdminDropdownProps) => {
  return (
    <div className="relative group">
      <button 
        className={cn(
          "flex items-center space-x-1 px-4 py-2 text-white hover:text-gold focus:outline-none transition-colors",
          isOpen ? "text-gold" : ""
        )}
        onClick={toggle}
        aria-expanded={isOpen}
        aria-label="Admin menu"
      >
        <span>Admin</span>
        <ChevronDown size={16} />
      </button>
      
      <div className={cn(
        "absolute right-0 mt-2 w-48 glass-morphism rounded-md shadow-lg overflow-hidden z-20 transition-all duration-300 origin-top-right",
        isOpen 
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
  );
};

export default AdminDropdown;
