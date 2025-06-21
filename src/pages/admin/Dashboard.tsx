
import { motion } from "framer-motion";
import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import AdminSplashScreen from "@/components/admin/AdminSplashScreen";

const Dashboard = () => {
  const { isAdmin, isStaff, user } = useAuth();
  const navigate = useNavigate();

  // Redirect non-admin users
  useEffect(() => {
    if (user && !isAdmin && !isStaff) {
      navigate('/');
    }
  }, [user, isAdmin, isStaff, navigate]);

  return (
    <div className="min-h-screen bg-black pb-16">
      <AdminSplashScreen />
    </div>
  );
};

export default Dashboard;
