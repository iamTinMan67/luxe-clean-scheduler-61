
import { motion } from "framer-motion";
import StatsCard from "./StatsCard";
import RevenueChart from "./RevenueChart";
import RecentBookings from "./RecentBookings";
import PackageDistribution from "./PackageDistribution";
import InventoryAlerts from "./InventoryAlerts";
import { DashboardData } from "./DashboardData";

export const DashboardContent = () => {
  const { stats, revenueData, bookings, packageData, inventoryAlerts } = DashboardData();

  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatsCard key={stat.title} {...stat} index={index} />
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <RevenueChart data={revenueData} />
        <PackageDistribution data={packageData} />
      </div>

      {/* Recent Bookings */}
      <RecentBookings bookings={bookings} />

      {/* Inventory Alerts */}
      <InventoryAlerts alerts={inventoryAlerts} />
    </div>
  );
};

export default DashboardContent;
