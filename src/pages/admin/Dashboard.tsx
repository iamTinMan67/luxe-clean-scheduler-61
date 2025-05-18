
import { motion } from "framer-motion";
import AdminPageTitle from "@/components/admin/AdminPageTitle";
import { DashboardContent } from "@/components/dashboard";

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-black pb-16">
      <section className="relative py-8">
        <div className="container mx-auto px-4">
          <AdminPageTitle 
            title="Admin Dashboard" 
            subtitle="Overview of your business performance and metrics" 
          />
          
          <DashboardContent />
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
