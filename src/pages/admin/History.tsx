
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import AdminPageTitle from "@/components/admin/AdminPageTitle";
import RecentBookings from "@/components/dashboard/RecentBookings";

const History = () => {
  // Mock bookings data that matches the RecentBookings component expectations
  const mockBookings = [
    {
      id: "1",
      customer: "John Smith",
      vehicle: "car",
      vehicleReg: "ABC123",
      package: "premium",
      date: "2024-01-15",
      time: "10:00",
      location: "Customer Location",
      status: "finished",
      totalPrice: 45,
      contact: "+44 7123 456789",
      email: "john.smith@email.com",
      createdAt: "2024-01-14"
    },
    {
      id: "2", 
      customer: "Jane Doe",
      vehicle: "suv",
      vehicleReg: "XYZ789",
      package: "standard",
      date: "2024-01-14",
      time: "14:00",
      location: "Customer Location",
      status: "finished",
      totalPrice: 25,
      contact: "+44 7987 654321",
      email: "jane.doe@email.com",
      createdAt: "2024-01-13"
    }
  ];

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
          
          <RecentBookings bookings={mockBookings} />
        </div>
      </section>
    </div>
  );
};

export default History;
