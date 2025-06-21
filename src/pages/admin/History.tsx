
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import AdminPageTitle from "@/components/admin/AdminPageTitle";
import RecentBookings from "@/components/dashboard/RecentBookings";

const History = () => {
  return (
    <div className="min-h-screen bg-black pb-16">
      <section className="relative py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center mb-8">
            <Link 
              to="/admin/management" 
              className="flex items-center space-x-2 text-yellow-400 hover:text-yellow-300 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Management</span>
            </Link>
          </div>

          <AdminPageTitle 
            title="Booking History" 
            subtitle="View past bookings and service records" 
          />
          
          <RecentBookings showAllBookings={true} />
        </div>
      </section>
    </div>
  );
};

export default History;
