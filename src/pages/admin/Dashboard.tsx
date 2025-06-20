
import { motion } from "framer-motion";
import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import AdminPageTitle from "@/components/admin/AdminPageTitle";
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
      <section className="relative py-8">
        <div className="container mx-auto px-4">
          <AdminSplashScreen />
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
