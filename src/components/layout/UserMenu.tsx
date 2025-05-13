
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, LogOut, Settings, UserCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const UserMenu = () => {
  const { user, signOut, isAdmin, isStaff } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  
  const handleSignOut = async () => {
    await signOut();
    toast.success("Logged out successfully");
    navigate('/');
    setIsMenuOpen(false);
  };
  
  if (!user) {
    // Render login button if not logged in
    return (
      <Link
        to="/login"
        className="ml-2 gold-gradient px-4 py-2 rounded text-black font-medium transition-all hover:shadow-lg hover:shadow-gold/20 focus:outline-none focus:ring-2 focus:ring-gold"
        aria-label="Login"
      >
        <User size={18} className="inline-block mr-2" />
        Staff Login
      </Link>
    );
  }
  
  // User is logged in, show profile menu
  return (
    <div className="relative">
      <button
        onClick={toggleMenu}
        className="flex items-center justify-center h-10 w-10 rounded-full bg-gray-800 border border-gray-700 text-white hover:border-gold transition-colors focus:outline-none focus:ring-2 focus:ring-gold"
        aria-label="User menu"
      >
        <UserCircle className="h-6 w-6" />
      </button>
      
      <div className={cn(
        "absolute right-0 mt-2 w-48 glass-morphism rounded-md shadow-lg overflow-hidden z-20 transition-all duration-200",
        isMenuOpen 
          ? "opacity-100 transform scale-100 pointer-events-auto" 
          : "opacity-0 transform scale-95 pointer-events-none"
      )}>
        <div className="py-1 border-b border-gray-800">
          <div className="px-4 py-2">
            <p className="text-sm font-medium text-white">{user.email}</p>
            {(isAdmin || isStaff) && (
              <p className="text-xs text-gold">
                {isAdmin ? 'Admin' : 'Staff'}
              </p>
            )}
          </div>
        </div>
        
        <div className="py-1">
          {(isAdmin || isStaff) && (
            <Link
              to="/admin/dashboard"
              className="block px-4 py-2 text-sm text-white hover:text-gold"
              onClick={() => setIsMenuOpen(false)}
            >
              <Settings size={16} className="inline-block mr-2" />
              Admin Dashboard
            </Link>
          )}
          
          <button
            onClick={handleSignOut}
            className="w-full text-left px-4 py-2 text-sm text-white hover:text-gold"
          >
            <LogOut size={16} className="inline-block mr-2" />
            Sign out
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserMenu;
