
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Initialize Supabase session handling
import { supabase } from "@/integrations/supabase/client";

// Log the session status for debugging
supabase.auth.getSession().then(({ data }) => {
  console.log("Initial auth session:", data.session ? "Authenticated" : "Not authenticated");
});

createRoot(document.getElementById("root")!).render(<App />);
