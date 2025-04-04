
import React from 'react';
import { motion } from "framer-motion";
import { Progress } from "@/components/ui/progress";
import { CalendarClock, User, Car, MapPin, CheckCircle2 } from "lucide-react";

interface BookingInfoCardProps {
  booking: {
    id: string;
    customerName: string;
    vehicleType: string;
    packageType: string;
    date: string;
    time: string;
    location: string;
    status: string;
    progressPercentage: number;
  };
  formatDate: (dateString: string) => string;
}

const BookingInfoCard: React.FC<BookingInfoCardProps> = ({ booking, formatDate }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-gray-900/50 backdrop-blur-sm rounded-lg p-6 border border-gray-800 mb-8"
    >
      <div className="flex justify-between items-start flex-wrap gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Booking #{booking.id}</h2>
          <div className="flex items-center text-gray-400">
            <CalendarClock className="h-4 w-4 mr-2 text-gold" />
            <span>
              {formatDate(booking.date)} at {booking.time}
            </span>
          </div>
        </div>
        
        <div className={`px-4 py-2 rounded-full ${
          booking.status === 'completed' 
            ? 'bg-green-900/30 text-green-400 border border-green-700'
            : booking.status === 'in-progress'
            ? 'bg-blue-900/30 text-blue-400 border border-blue-700'
            : booking.status === 'confirmed'
            ? 'bg-amber-900/30 text-amber-400 border border-amber-700'
            : 'bg-gray-900/30 text-gray-400 border border-gray-700'
        }`}>
          {booking.status === 'completed' && 'Completed'}
          {booking.status === 'in-progress' && 'In Progress'}
          {booking.status === 'confirmed' && 'Confirmed'}
          {booking.status === 'pending' && 'Pending'}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="space-y-3">
          <div className="flex items-start">
            <User className="h-5 w-5 mr-3 text-gold mt-0.5" />
            <div>
              <h3 className="text-sm text-gray-400">Customer</h3>
              <p className="text-white">{booking.customerName}</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <Car className="h-5 w-5 mr-3 text-gold mt-0.5" />
            <div>
              <h3 className="text-sm text-gray-400">Vehicle</h3>
              <p className="text-white">{booking.vehicleType}</p>
            </div>
          </div>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-start">
            <MapPin className="h-5 w-5 mr-3 text-gold mt-0.5" />
            <div>
              <h3 className="text-sm text-gray-400">Location</h3>
              <p className="text-white">{booking.location}</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <CheckCircle2 className="h-5 w-5 mr-3 text-gold mt-0.5" />
            <div>
              <h3 className="text-sm text-gray-400">Package</h3>
              <p className="text-white">{booking.packageType} Package</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mb-2">
        <div className="flex justify-between mb-2">
          <h3 className="text-white font-medium">Overall Progress</h3>
          <span className="text-gold font-medium">{booking.progressPercentage}%</span>
        </div>
        <Progress 
          value={booking.progressPercentage} 
          className="h-2 bg-gray-800"
        />
      </div>
    </motion.div>
  );
};

export default BookingInfoCard;
