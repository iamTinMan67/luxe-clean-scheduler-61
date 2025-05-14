
import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import NavLink from "./NavLink";

interface AdminRoute {
  path: string;
  label: string;
  subRoutes?: AdminRoute[];
}

interface AdminDropdownProps {
  adminRoutes: AdminRoute[];
  isOpen: boolean;
  toggle: () => void;
}

const AdminDropdown = ({ adminRoutes, isOpen, toggle }: AdminDropdownProps) => {
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);

  const toggleSubmenu = (label: string) => {
    setOpenSubmenu(openSubmenu === label ? null : label);
  };

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
        "absolute right-0 mt-2 w-64 glass-morphism rounded-md shadow-lg overflow-hidden z-20 transition-all duration-300 origin-top-right",
        isOpen 
          ? "opacity-100 transform scale-100 pointer-events-auto" 
          : "opacity-0 transform scale-95 pointer-events-none"
      )}>
        <div className="py-1 space-y-1">
          {adminRoutes.map((route) => (
            route.subRoutes ? (
              <div key={route.label} className="relative">
                <button
                  className="flex w-full items-center justify-between px-4 py-2 text-white hover:text-gold hover:bg-black/30 transition-colors"
                  onClick={() => toggleSubmenu(route.label)}
                >
                  <span>{route.label}</span>
                  <ChevronRight 
                    size={16} 
                    className={cn(
                      "transition-transform", 
                      openSubmenu === route.label ? "rotate-90" : ""
                    )}
                  />
                </button>
                {openSubmenu === route.label && (
                  <div className="pl-4 border-l border-gold/30 ml-4 mt-1 mb-1">
                    {route.subRoutes.map((subRoute) => (
                      <NavLink 
                        key={subRoute.path}
                        to={subRoute.path}
                        isDropdownItem
                      >
                        {subRoute.label}
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <NavLink 
                key={route.path}
                to={route.path}
                isDropdownItem
              >
                {route.label}
              </NavLink>
            )
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDropdown;
