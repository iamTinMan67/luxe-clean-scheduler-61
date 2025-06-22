
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";

interface Booking {
  id: string;
  customer: string;
  vehicle: string;
  package: string;
  date: string;
  time: string;
  status: string;
}

interface RecentBookingsProps {
  bookings: Booking[];
}

const RecentBookings = ({ bookings }: RecentBookingsProps) => {
  // Function to get status badge styling
  const getStatusBadgeStyles = (status: string) => {
    switch(status) {
      case 'pending':
        return 'bg-red-900/30 text-red-400 border border-red-700';
      case 'confirmed':
        return 'bg-amber-900/30 text-amber-400 border border-amber-700';
      case 'inspecting':
        return 'bg-yellow-900/30 text-yellow-400 border border-yellow-700';
      case 'inspected':
        return 'bg-teal-900/30 text-teal-400 border border-teal-700';
      case 'in-progress':
        return 'bg-blue-900/30 text-blue-400 border border-blue-700';
      case 'completed':
        return 'bg-green-900/30 text-green-400 border border-green-700';
      case 'finished':
        return 'bg-purple-900/30 text-purple-400 border border-purple-700';
      default:
        return 'bg-gray-900/30 text-gray-400 border border-gray-700';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
      className="mb-8"
    >
      <Card className="bg-gray-900 border-gray-800 p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-white">Current Bookings</h3>
          <div className="px-3 py-1 rounded-full bg-blue-900/30 text-blue-400 border border-blue-700 text-xs font-medium">
            {bookings.length} active
          </div>
        </div>
        
        {bookings.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <p>No current bookings to display</p>
            <p className="text-sm mt-2">All bookings are either completed or finished</p>
          </div>
        ) : (
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
                {bookings.map(booking => (
                  <tr key={booking.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                    <td className="py-3 px-4 text-white">{booking.id}</td>
                    <td className="py-3 px-4 text-white">{booking.customer}</td>
                    <td className="py-3 px-4 text-gray-300">{booking.vehicle}</td>
                    <td className="py-3 px-4 text-gray-300">{booking.package}</td>
                    <td className="py-3 px-4 text-gray-300">
                      {booking.date} <span className="text-gray-500">at</span> {booking.time}
                    </td>
                    <td className="py-3 px-4">
                      <div className={`px-2 py-1 rounded-full text-xs inline-flex items-center justify-center ${getStatusBadgeStyles(booking.status)}`}>
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1).replace('-', ' ')}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </motion.div>
  );
};

export default RecentBookings;
