
import { Users, Car, CalendarClock, DollarSign } from "lucide-react";

// Dashboard data file to store all mock data
export const statsData = [
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
    title: "Revenue", 
    value: "£29,482", 
    change: "+21%", 
    trend: "up",
    icon: <DollarSign className="h-5 w-5 text-gold" />
  }
];

// Monthly revenue data
export const revenueData = [
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
export const packageData = [
  { name: "Basic", value: 35 },
  { name: "Medium", value: 40 },
  { name: "Elite", value: 25 }
];

// Recent bookings
export const recentBookings = [
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
export const inventoryAlerts = [
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

// Main function that returns all dashboard data
export const DashboardData = () => {
  return {
    stats: statsData,
    revenueData,
    bookings: recentBookings,
    packageData,
    inventoryAlerts
  };
};
