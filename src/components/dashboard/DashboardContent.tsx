
import { StatsCard, RevenueChart, PackageDistribution, FeedbackDistribution, InventoryAlerts, RecentBookings } from '@/components/dashboard';
import { statsData, revenueData, packageData, inventoryAlerts, recentBookings } from '@/components/dashboard/DashboardData';
import FeedbackSnippet from "../home/feedback/FeedbackSnippet";
import DataMigrationTrigger from "@/components/DataMigrationTrigger";

const DashboardContent = () => {
  return (
    <>
      {/* Inventory Alerts - At the top */}
      <InventoryAlerts alerts={inventoryAlerts} />
       
      {/* Recent Bookings - Below Inventory Alerts */}
      <div className="mb-8">
        <RecentBookings bookings={recentBookings} />
      </div>
      
      {/* Recent Feedback Section - Above Feedback Distribution */}
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
        <FeedbackSnippet dashboardMode={true} />
      </div>

      {/* Feedback Distribution Chart */}
      <FeedbackDistribution />
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statsData.map((stat, index) => (
          <StatsCard 
            key={stat.title}
            title={stat.title}
            value={stat.value}
            change={stat.change}
            trend={stat.trend}
            icon={stat.icon}
            index={index}
          />
        ))}
      </div>
      
      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Revenue Chart */}
        <RevenueChart data={revenueData} />
        
        {/* Package Distribution Chart */}
        <PackageDistribution data={packageData} />
      </div>
    </>
  );
};

export default DashboardContent;
