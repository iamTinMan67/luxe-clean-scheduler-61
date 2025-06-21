
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import AdminPageTitle from "@/components/admin/AdminPageTitle";
import { DashboardContent } from "@/components/dashboard";

const Analytics = () => {
  return (
    <div className="min-h-screen bg-black pb-16 relative z-10">
      <section className="relative py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center mb-8">
            <Link 
              to="/admin/dashboard" 
              className="flex items-center space-x-2 text-yellow-400 hover:text-yellow-300 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Dashboard</span>
            </Link>
          </div>

          <AdminPageTitle 
            title="Analytics" 
            subtitle="Business insights and performance metrics" 
          />
          
          <DashboardContent />
        </div>
      </section>
    </div>
  );
};

export default Analytics;
