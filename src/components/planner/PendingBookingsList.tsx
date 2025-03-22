
import React from 'react';
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Booking } from '@/types/booking';
import PendingBookingItem from './PendingBookingItem';

interface PendingBookingsListProps {
  pendingBookings: Booking[];
  handleConfirmBooking: (bookingId: string) => void;
  handleCancelBooking: (bookingId: string) => void;
  getBookingBackground: (booking: Booking) => string;
}

const PendingBookingsList: React.FC<PendingBookingsListProps> = ({
  pendingBookings,
  handleConfirmBooking,
  handleCancelBooking,
  getBookingBackground
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="mb-8"
    >
      <Card className="bg-gray-900 border-gray-800 p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white">Pending Bookings</h2>
          <div className="px-3 py-1 rounded-full bg-amber-900/30 text-amber-400 border border-amber-700 text-xs font-medium">
            {pendingBookings.length} pending
          </div>
        </div>
        
        {pendingBookings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pendingBookings.map(booking => (
              <PendingBookingItem 
                key={booking.id}
                booking={booking}
                onConfirm={handleConfirmBooking}
                onCancel={handleCancelBooking}
                getBookingBackground={getBookingBackground}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-400">
            <p>No pending bookings to display</p>
          </div>
        )}
      </Card>
    </motion.div>
  );
};

export default PendingBookingsList;
