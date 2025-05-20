
import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, ChevronRight } from "lucide-react";
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
}

const MobileMenu = ({ isOpen, adminRoutes }: MobileMenuProps) => {
  const [adminDropdownOpen, setAdminDropdownOpen] = useState(false);
  const [contactDropdownOpen, setContactDropdownOpen] = useState(false);
  const [openSubmenus, setOpenSubmenus] = useState<string[]>([]);
  const { user, signOut, isAdmin, isStaff } = useAuth();
  
  const toggleAdminDropdown = () => setAdminDropdownOpen(!adminDropdownOpen);
  const toggleContactDropdown = () => setContactDropdownOpen(!contactDropdownOpen);

  const toggleSubmenu = (label: string) => {
    setOpenSubmenus(prev => 
      prev.includes(label) 
        ? prev.filter(item => item !== label) 
        : [...prev, label]
    );
  };

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
        
        {/* Contact Us Dropdown */}
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
                  route.subRoutes ? (
                    <div key={route.label}>
                      <button
                        className="text-left py-2 px-4 w-full text-lg text-white flex items-center justify-between"
                        onClick={() => toggleSubmenu(route.label)}
                      >
                        <span>{route.label}</span>
                        <ChevronRight 
                          size={16} 
                          className={cn(
                            "transition-transform",
                            openSubmenus.includes(route.label) ? "rotate-90" : ""
                          )}
                        />
                      </button>
                      
                      {openSubmenus.includes(route.label) && (
                        <div className="pl-4 border-l border-gold/30 ml-4 space-y-1">
                          {route.subRoutes.map((subRoute) => (
                            <NavLink 
                              key={subRoute.path} 
                              to={subRoute.path} 
                              isMobile
                            >
                              {subRoute.label}
                            </NavLink>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <NavLink key={route.path} to={route.path} isMobile>
                      {route.label}
                    </NavLink>
                  )
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
