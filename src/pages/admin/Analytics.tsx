
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import AdminPageTitle from "@/components/admin/AdminPageTitle";
import { DashboardContent } from "@/components/dashboard";
import RecentBookings from "@/components/dashboard/RecentBookings";
import { useCurrentBookings } from "@/hooks/useCurrentBookings";

const Analytics = () => {
  const { currentBookings, loading } = useCurrentBookings();

  // Transform bookings to ensure they have the package property for compatibility
  const transformedBookings = currentBookings.map(booking => ({
    ...booking,
    package: booking.packageType || booking.package || 'standard',
    date: booking.date instanceof Date ? booking.date.toISOString().split('T')[0] : booking.date
  }));

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
          
          {/* Current Bookings Section */}
          {loading ? (
            <div className="mb-8 text-center text-gray-400">
              <p>Loading current bookings...</p>
            </div>
          ) : (
            <RecentBookings bookings={transformedBookings} />
          )}
          
          <DashboardContent />
        </div>
      </section>
    </div>
  );
};

export default Analytics;
