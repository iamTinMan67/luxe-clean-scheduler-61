
import React from 'react';
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";
import { Booking } from '@/types/booking';
import BookingCard from '@/components/booking/BookingCard';

interface PendingBookingsListProps {
  pendingBookings: Booking[];
  handleConfirmBooking: (bookingId: string, selectedStaff: string[], travelMinutes: number) => void;
  handleCancelBooking: (bookingId: string) => void;
  getBookingBackground: (booking: Booking) => string;
  conflictCount: number;
}

const PendingBookingsList: React.FC<PendingBookingsListProps> = ({
  pendingBookings,
  handleConfirmBooking,
  handleCancelBooking,
  getBookingBackground,
  conflictCount
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-8"
    >
      <Card className="bg-gray-900 border-gray-800 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Pending Bookings</h2>
          <div className="flex items-center space-x-4">
            <span className="bg-amber-900/30 text-amber-400 px-3 py-1 rounded-full text-sm border border-amber-700">
              {pendingBookings.length} pending
            </span>
            {conflictCount > 0 && (
              <div className="flex items-center space-x-2 bg-red-900/30 text-red-400 px-3 py-1 rounded-full text-sm border border-red-700">
                <AlertTriangle className="w-4 h-4" />
                <span>{conflictCount} conflicts</span>
              </div>
            )}
          </div>
        </div>
        
        {pendingBookings.length > 0 ? (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            {pendingBookings.map(booking => (
              <BookingCard
                key={booking.id}
                booking={booking}
                variant="default"
                showActions={true}
                className="border-l-4 border-amber-500"
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-400">No pending bookings</p>
          </div>
        )}
      </Card>
    </motion.div>
  );
};

export default PendingBookingsList;
