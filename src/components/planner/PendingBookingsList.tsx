
import React from 'react';
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Booking } from '@/types/booking';
import PendingBookingItem from './PendingBookingItem';

interface PendingBookingsListProps {
  pendingBookings: Booking[];
  handleConfirmBooking: (bookingId: string, selectedStaff: string[], travelMinutes: number) => void;
  handleCancelBooking: (bookingId: string) => void;
  getBookingBackground: (booking: Booking) => string;
  conflictCount?: number;
}

const PendingBookingsList: React.FC<PendingBookingsListProps> = ({
  pendingBookings,
  handleConfirmBooking,
  handleCancelBooking,
  getBookingBackground,
  conflictCount = 0
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="mb-8"
    >
      <Card className="bg-gray-900 border-gray-800 p-6">
        <PendingBookingsHeader 
          pendingCount={pendingBookings.length}
          conflictCount={conflictCount}
        />
        
        <PendingBookingsContent 
          pendingBookings={pendingBookings}
          handleConfirmBooking={handleConfirmBooking}
          handleCancelBooking={handleCancelBooking}
          getBookingBackground={getBookingBackground}
        />
      </Card>
    </motion.div>
  );
};

interface PendingBookingsHeaderProps {
  pendingCount: number;
  conflictCount: number;
}

const PendingBookingsHeader: React.FC<PendingBookingsHeaderProps> = ({ 
  pendingCount, 
  conflictCount 
}) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-xl font-bold text-white">Pending Bookings</h2>
      <div className="flex items-center space-x-2">
        <div className="px-3 py-1 rounded-full bg-red-900/30 text-red-400 border border-red-700 text-xs font-medium">
          {pendingCount} pending
        </div>
        {conflictCount > 0 && (
          <div className="px-3 py-1 rounded-full bg-orange-900/30 text-orange-400 border border-orange-700 text-xs font-medium">
            {conflictCount} conflicts
          </div>
        )}
      </div>
    </div>
  );
};

interface PendingBookingsContentProps {
  pendingBookings: Booking[];
  handleConfirmBooking: (bookingId: string, selectedStaff: string[], travelMinutes: number) => void;
  handleCancelBooking: (bookingId: string) => void;
  getBookingBackground: (booking: Booking) => string;
}

const PendingBookingsContent: React.FC<PendingBookingsContentProps> = ({
  pendingBookings,
  handleConfirmBooking,
  handleCancelBooking,
  getBookingBackground
}) => {
  if (pendingBookings.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        <p>No pending bookings to display</p>
      </div>
    );
  }

  return (
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
  );
};

export default PendingBookingsList;
