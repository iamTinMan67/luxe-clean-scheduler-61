
import { useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { 
  Users, Car, CalendarClock, DollarSign, 
  TrendingUp, Droplets, CheckCircle, AlertCircle 
} from "lucide-react";
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, 
  Cell, XAxis, YAxis, CartesianGrid, Tooltip, 
  Legend, ResponsiveContainer 
} from "recharts";

const Dashboard = () => {
  // Mock data for statistics
  const stats = [
    { 
      title: "Total Bookings", 
      value: "247", 
      change: "+12%", 
      trend: "up",
      icon: <CalendarClock className="h-5 w-5 text-blue-500" />
    },
    { 
      title: "Customers", 
      value: "189", 
      change: "+8%", 
      trend: "up",
      icon: <Users className="h-5 w-5 text-green-500" />
    },
    { 
      title: "Vehicles Serviced", 
      value: "312", 
      change: "+15%", 
      trend: "up",
      icon: <Car className="h-5 w-5 text-purple-500" />
    },
    { 
      title: "Revenue", 
      value: "£29,482", 
      change: "+21%", 
      trend: "up",
      icon: <DollarSign className="h-5 w-5 text-gold" />
    }
  ];
  
  // Monthly revenue data
  const revenueData = [
    { name: "Jan", revenue: 7500 },
    { name: "Feb", revenue: 8200 },
    { name: "Mar", revenue: 9100 },
    { name: "Apr", revenue: 8700 },
    { name: "May", revenue: 11200 },
    { name: "Jun", revenue: 10300 },
    { name: "Jul", revenue: 12500 },
    { name: "Aug", revenue: 14200 },
    { name: "Sep", revenue: 13100 },
    { name: "Oct", revenue: 15700 },
    { name: "Nov", revenue: 16900 },
    { name: "Dec", revenue: 18500 }
  ];
  
  // Service package distribution
  const packageData = [
    { name: "Basic", value: 35 },
    { name: "Medium", value: 40 },
    { name: "Elite", value: 25 }
  ];
  
  // Vehicle type distribution
  const vehicleData = [
    { name: "Car", count: 65 },
    { name: "SUV", count: 45 },
    { name: "Van", count: 25 },
    { name: "Truck", count: 15 }
  ];
  
  // Recent bookings
  const recentBookings = [
    {
      id: "BK-12345",
      customer: "John Smith",
      vehicle: "Porsche 911",
      package: "Elite",
      date: "2024-09-15",
      time: "10:00",
      status: "completed"
    },
    {
      id: "BK-12346",
      customer: "Sarah Johnson",
      vehicle: "Range Rover Sport",
      package: "Medium",
      date: "2024-09-16",
      time: "14:30",
      status: "in-progress"
    },
    {
      id: "BK-12347",
      customer: "Michael Brown",
      vehicle: "Tesla Model S",
      package: "Elite",
      date: "2024-09-17",
      time: "09:00",
      status: "confirmed"
    },
    {
      id: "BK-12348",
      customer: "Emma Wilson",
      vehicle: "BMW M4",
      package: "Basic",
      date: "2024-09-18",
      time: "11:00",
      status: "pending"
    },
    {
      id: "BK-12349",
      customer: "David Clark",
      vehicle: "Mercedes S-Class",
      package: "Medium",
      date: "2024-09-19",
      time: "15:00",
      status: "confirmed"
    }
  ];
  
  // Inventory alerts
  const inventoryAlerts = [
    {
      id: 1,
      item: "Ceramic Coating Solution",
      status: "low",
      quantity: 2,
      reorderPoint: 5
    },
    {
      id: 2,
      item: "Microfiber Towels",
      status: "low",
      quantity: 10,
      reorderPoint: 20
    },
    {
      id: 3,
      item: "Interior Cleaner",
      status: "out",
      quantity: 0,
      reorderPoint: 3
    }
  ];
  
  // Colors for pie chart
  const COLORS = ['#FFD700', '#0088FE', '#00C49F'];
  
  return (
    <div className="min-h-screen bg-black pb-16">
      <section className="relative py-8">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold text-white">
              Admin <span className="text-gold">Dashboard</span>
            </h1>
            <p className="text-gray-400">
              Overview of your business performance and metrics
            </p>
          </motion.div>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="bg-gray-900 border-gray-800 p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-gray-400 text-sm mb-1">{stat.title}</p>
                      <h3 className="text-2xl font-bold text-white">{stat.value}</h3>
                    </div>
                    <div className="h-10 w-10 rounded-full bg-gray-800 flex items-center justify-center">
                      {stat.icon}
                    </div>
                  </div>
                  <div className="mt-2 flex items-center">
                    <TrendingUp className={`h-4 w-4 mr-1 ${
                      stat.trend === 'up' ? 'text-green-500' : 'text-red-500'
                    }`} />
                    <span className={`text-xs ${
                      stat.trend === 'up' ? 'text-green-500' : 'text-red-500'
                    }`}>
                      {stat.change} from last month
                    </span>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
          
          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Revenue Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="bg-gray-900 border-gray-800 p-6">
                <h3 className="text-lg font-bold text-white mb-4">Monthly Revenue</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={revenueData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="name" stroke="#9CA3AF" />
                      <YAxis stroke="#9CA3AF" />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', color: '#F9FAFB' }}
                        itemStyle={{ color: '#F9FAFB' }}
                        formatter={(value) => [`£${value}`, 'Revenue']}
                      />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="revenue" 
                        stroke="#FFD700" 
                        strokeWidth={2}
                        activeDot={{ r: 8 }} 
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </motion.div>
            
            {/* Package Distribution Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card className="bg-gray-900 border-gray-800 p-6">
                <h3 className="text-lg font-bold text-white mb-4">Service Package Distribution</h3>
                <div className="h-80 flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={packageData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {packageData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', color: '#F9FAFB' }}
                        itemStyle={{ color: '#F9FAFB' }}
                        formatter={(value) => [`${value}%`, 'Percentage']}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </motion.div>
            
            {/* Vehicle Types Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Card className="bg-gray-900 border-gray-800 p-6">
                <h3 className="text-lg font-bold text-white mb-4">Vehicle Type Distribution</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={vehicleData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="name" stroke="#9CA3AF" />
                      <YAxis stroke="#9CA3AF" />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', color: '#F9FAFB' }}
                        itemStyle={{ color: '#F9FAFB' }}
                      />
                      <Legend />
                      <Bar dataKey="count" fill="#FFD700" name="Count" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </motion.div>
            
            {/* Inventory Alerts */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <Card className="bg-gray-900 border-gray-800 p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold text-white">Inventory Alerts</h3>
                  <div className="px-3 py-1 rounded-full bg-red-900/30 text-red-500 border border-red-700 text-xs font-medium">
                    {inventoryAlerts.length} alerts
                  </div>
                </div>
                <div className="space-y-4">
                  {inventoryAlerts.map(alert => (
                    <div 
                      key={alert.id} 
                      className="flex items-center justify-between border-b border-gray-800 pb-3"
                    >
                      <div className="flex items-start">
                        {alert.status === 'out' ? (
                          <AlertCircle className="h-5 w-5 text-red-500 mr-3 mt-0.5" />
                        ) : (
                          <Droplets className="h-5 w-5 text-amber-500 mr-3 mt-0.5" />
                        )}
                        <div>
                          <h4 className="text-white font-medium">{alert.item}</h4>
                          <p className="text-gray-400 text-sm">
                            {alert.status === 'out' 
                              ? 'Out of stock' 
                              : `Low stock: ${alert.quantity} remaining`}
                          </p>
                        </div>
                      </div>
                      <button className="px-3 py-1 rounded-md bg-gray-800 text-white text-sm hover:bg-gray-700 transition-colors">
                        Reorder
                      </button>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>
          </div>
          
          {/* Recent Bookings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mb-8"
          >
            <Card className="bg-gray-900 border-gray-800 p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-white">Recent Bookings</h3>
                <button className="text-gold text-sm hover:underline">View All</button>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-800">
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">ID</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">Customer</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">Vehicle</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">Package</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">Date & Time</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentBookings.map(booking => (
                      <tr key={booking.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                        <td className="py-3 px-4 text-white">{booking.id}</td>
                        <td className="py-3 px-4 text-white">{booking.customer}</td>
                        <td className="py-3 px-4 text-gray-300">{booking.vehicle}</td>
                        <td className="py-3 px-4 text-gray-300">{booking.package}</td>
                        <td className="py-3 px-4 text-gray-300">
                          {booking.date} <span className="text-gray-500">at</span> {booking.time}
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            booking.status === 'completed' 
                              ? 'bg-green-900/30 text-green-400 border border-green-700'
                              : booking.status === 'in-progress'
                              ? 'bg-blue-900/30 text-blue-400 border border-blue-700'
                              : booking.status === 'confirmed'
                              ? 'bg-amber-900/30 text-amber-400 border border-amber-700'
                              : 'bg-gray-900/30 text-gray-400 border border-gray-700'
                          }`}>
                            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
