
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { usePlannerCalendar } from "@/hooks/usePlannerCalendar";
import PendingBookingItem from "@/components/planner/PendingBookingItem";

const PendingNotificationsView = () => {
  const {
    pendingBookings,
    handleConfirmBooking,
    handleCancelBooking,
    getBookingBackground,
    conflictCount
  } = usePlannerCalendar();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-8"
    >
      <Card className="bg-gray-900 border-gray-800 p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white">Pending Notifications</h2>
          <div className="flex items-center space-x-2">
            <div className="px-3 py-1 rounded-full bg-red-900/30 text-red-400 border border-red-700 text-xs font-medium">
              {pendingBookings.length} pending
            </div>
            {conflictCount > 0 && (
              <div className="px-3 py-1 rounded-full bg-orange-900/30 text-orange-400 border border-orange-700 text-xs font-medium">
                {conflictCount} conflicts
              </div>
            )}
          </div>
        </div>
        
        {pendingBookings.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <p>No pending notifications to display</p>
          </div>
        ) : (
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
        )}
      </Card>
    </motion.div>
  );
};

export default PendingNotificationsView;
