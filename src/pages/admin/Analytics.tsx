
import { motion } from "framer-motion";
import AdminPageTitle from "@/components/admin/AdminPageTitle";
import { DashboardContent } from "@/components/dashboard";

const Analytics = () => {
  return (
    <div className="min-h-screen bg-black pb-16">
      <section className="relative py-8">
        <div className="container mx-auto px-4">
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
