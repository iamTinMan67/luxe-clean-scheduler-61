
import { createContext, useState, useEffect, useContext } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

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
  isLoading: true, // Changed to true initially
  signOut: async () => {},
};

const AuthContext = createContext<AuthContextType>(defaultContext);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true); // Changed to true initially
  const [userRole, setUserRole] = useState<string | null>(null);

  // Function to fetch user role
  const fetchUserRole = async (userId: string) => {
    try {
      console.log("Fetching user role for:", userId);
      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .maybeSingle(); // Changed from single() to avoid errors

      if (error) {
        console.error('Error fetching user role:', error);
        return;
      }

      console.log("User role data:", data);
      setUserRole(data?.role || null);
    } catch (error) {
      console.error('Error in fetchUserRole:', error);
    }
  };

  useEffect(() => {
    console.log("AuthContext useEffect running");
    setIsLoading(true);
    
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        console.log("Auth state changed:", event, currentSession ? "Session exists" : "No session");
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
      }
    );
    
    // THEN check for an existing session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      console.log("Initial session check:", currentSession ? "Session exists" : "No session");
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      
      if (currentSession?.user) {
        // Use setTimeout to avoid potential deadlocks
        setTimeout(() => {
          fetchUserRole(currentSession.user.id);
        }, 0);
      }
      setIsLoading(false);
    });
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    try {
      // Clean up auth state first (import from authCleanup if needed)
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
      
      // Force page reload for a clean state
      window.location.href = '/login';
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Debug output for role
  console.log("Current user role:", userRole);

  const value = {
    session,
    user,
    isAdmin: userRole === 'admin',
    isStaff: userRole === 'staff',
    isCustomer: userRole === 'customer',
    isLoading,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
