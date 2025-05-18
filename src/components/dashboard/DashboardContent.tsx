
import { StatsCard, RevenueChart, PackageDistribution, VehicleTypeChart, InventoryAlerts, RecentBookings } from '@/components/dashboard';
import { statsData, revenueData, packageData, vehicleData, inventoryAlerts, recentBookings } from '@/components/dashboard/DashboardData';

const DashboardContent = () => {
  return (
    <>
      {/* Recent Bookings - At the top */}
      <RecentBookings bookings={recentBookings} />
      
      {/* Inventory Alerts - Below Recent Bookings */}
      <div className="mb-8">
        <InventoryAlerts alerts={inventoryAlerts} />
      </div>
      
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
        
        {/* Vehicle Types Chart */}
        <VehicleTypeChart data={vehicleData} />
      </div>
    </>
  );
};

export default DashboardContent;
