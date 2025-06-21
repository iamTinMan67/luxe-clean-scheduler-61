
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { usePlannerCalendar } from "@/hooks/usePlannerCalendar";
import { Clock, AlertCircle } from "lucide-react";

const CompactPendingBookings = () => {
  const { pendingBookings, conflictCount } = usePlannerCalendar();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="bg-gray-900 border-gray-800">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-gold" />
              Pending Bookings
            </h3>
            <div className="flex items-center space-x-2">
              <div className="px-2 py-1 rounded-full bg-red-900/30 text-red-400 border border-red-700 text-xs font-medium">
                {pendingBookings.length}
              </div>
              {conflictCount > 0 && (
                <div className="px-2 py-1 rounded-full bg-orange-900/30 text-orange-400 border border-orange-700 text-xs font-medium">
                  {conflictCount} conflicts
                </div>
              )}
            </div>
          </div>
          
          {pendingBookings.length === 0 ? (
            <div className="text-center py-4 text-gray-400">
              <p className="text-xs">No pending bookings</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {pendingBookings.slice(0, 3).map(booking => (
                <div key={booking.id} className="flex items-center justify-between bg-gray-800 rounded p-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-white truncate">{booking.customer}</p>
                    <p className="text-xs text-gray-400">{booking.vehicle || 'N/A'}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    {booking.status === 'pending' && (
                      <AlertCircle className="w-3 h-3 text-red-400" />
                    )}
                    <span className="text-xs text-gray-400">{booking.time}</span>
                  </div>
                </div>
              ))}
              {pendingBookings.length > 3 && (
                <div className="text-xs text-gray-400 text-center pt-1">
                  +{pendingBookings.length - 3} more
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default CompactPendingBookings;
