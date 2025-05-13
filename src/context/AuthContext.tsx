
import { createContext, useState, useEffect, useContext } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface AuthContextType {
  session: Session | null;
  user: User | null;
  isAdmin: boolean;
  isStaff: boolean;
  isCustomer: boolean;
  isLoading: boolean;
  signOut: () => Promise<void>;
}

// Default values for the context
const defaultContext: AuthContextType = {
  session: null,
  user: null,
  isAdmin: false,
  isStaff: false,
  isCustomer: false,
  isLoading: true,
  signOut: async () => {},
};

const AuthContext = createContext<AuthContextType>(defaultContext);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [initialCheckComplete, setInitialCheckComplete] = useState<boolean>(false);

  // Function to fetch user role
  const fetchUserRole = async (userId: string) => {
    try {
      console.log("Fetching user role for:", userId);
      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.error('Error fetching user role:', error);
        return;
      }

      console.log("User role data:", data);
      setUserRole(data?.role || null);
      
      // Show a toast message if user is an admin
      if (data?.role === 'admin') {
        toast.success("Logged in as Administrator", {
          id: "admin-login",
          duration: 3000
        });
      } else if (data?.role === 'staff') {
        toast.success("Logged in as Staff", {
          id: "staff-login",
          duration: 3000
        });
      } else if (!data?.role || data.role === 'customer') {
        // If the user is not staff or admin, sign them out immediately
        console.log("Non-staff user detected, signing out");
        supabase.auth.signOut();
        toast.error("Access denied", {
          description: "Only staff members can access this system",
          duration: 5000
        });
      }
    } catch (error) {
      console.error('Error in fetchUserRole:', error);
    }
  };

  useEffect(() => {
    console.log("AuthContext useEffect running");
    setIsLoading(true);
    
    const handleAuthChange = (currentSession: Session | null) => {
      console.log("Auth state changed:", currentSession ? "Session exists" : "No session");
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      
      if (currentSession?.user) {
        // Use setTimeout to avoid Supabase auth deadlock
        setTimeout(() => {
          fetchUserRole(currentSession.user.id);
        }, 0);
      } else {
        setUserRole(null);
      }
      
      setIsLoading(false);
      setInitialCheckComplete(true);
    };
    
    // First check for an existing session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      console.log("Initial session check:", currentSession ? "Session exists" : "No session");
      handleAuthChange(currentSession);
    }).catch(err => {
      console.error("Error getting session:", err);
      setIsLoading(false);
      setInitialCheckComplete(true);
    });
    
    // THEN set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, currentSession) => {
        handleAuthChange(currentSession);
      }
    );
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    try {
      setIsLoading(true);
      
      // Clean up auth state first
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
          localStorage.removeItem(key);
        }
      });
      
      // Attempt global sign out
      await supabase.auth.signOut({ scope: 'global' });
      setSession(null);
      setUser(null);
      setUserRole(null);
      
      toast.success("Logged out successfully");
      
      // Force page reload for a clean state
      window.location.href = '/login';
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error("Error signing out", {
        description: "Please try again or refresh the page."
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Get initial auth state for SSR
  console.log("Current user role:", userRole);

  // Show loading state only during initial load
  const shouldShowLoading = isLoading && !initialCheckComplete;

  const value = {
    session,
    user,
    isAdmin: userRole === 'admin',
    isStaff: userRole === 'staff',
    isCustomer: userRole === 'customer',
    isLoading: shouldShowLoading,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
