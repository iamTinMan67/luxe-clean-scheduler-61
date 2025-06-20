
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, AlertTriangle, Bell } from "lucide-react";
import { Link } from "react-router-dom";

const PendingNotificationsSummary = () => {
  // This would normally come from your booking state/hooks
  // For now, using placeholder data to show the concept
  const pendingBookingsCount = 3;
  const urgentTasksCount = 2;
  const newFeedbackCount = 1;

  const totalPendingItems = pendingBookingsCount + urgentTasksCount + newFeedbackCount;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-4"
    >
      <div className="flex items-center space-x-3 mb-4">
        <div className="p-2 rounded-lg bg-blue-500/20 border-blue-500/30 border">
          <Bell className="w-5 h-5 text-blue-400" />
        </div>
        <h3 className="text-lg font-semibold text-white">Pending Notifications</h3>
        <span className="px-2 py-1 text-xs bg-blue-500/20 text-blue-400 rounded-full border border-blue-500/30">
          Featured
        </span>
      </div>

      <Card className="bg-gradient-to-r from-blue-500/10 to-blue-500/5 border-blue-500/30">
        <CardContent className="p-6">
          <div className="text-center mb-6">
            <div className="text-3xl font-bold text-white mb-2">{totalPendingItems}</div>
            <div className="text-blue-400 text-sm">Items requiring attention</div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <Link to="/admin/planner-calendar" className="group">
              <div className="text-center p-3 rounded-lg bg-orange-500/10 border border-orange-500/20 hover:border-orange-500/40 transition-colors">
                <Clock className="w-6 h-6 text-orange-400 mx-auto mb-2" />
                <div className="text-xl font-semibold text-white group-hover:text-orange-400 transition-colors">
                  {pendingBookingsCount}
                </div>
                <div className="text-xs text-gray-400">Pending Bookings</div>
              </div>
            </Link>

            <Link to="/admin/todo-list" className="group">
              <div className="text-center p-3 rounded-lg bg-red-500/10 border border-red-500/20 hover:border-red-500/40 transition-colors">
                <AlertTriangle className="w-6 h-6 text-red-400 mx-auto mb-2" />
                <div className="text-xl font-semibold text-white group-hover:text-red-400 transition-colors">
                  {urgentTasksCount}
                </div>
                <div className="text-xs text-gray-400">Urgent Tasks</div>
              </div>
            </Link>

            <Link to="/admin/feedback-manager" className="group">
              <div className="text-center p-3 rounded-lg bg-blue-500/10 border border-blue-500/20 hover:border-blue-500/40 transition-colors">
                <Bell className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                <div className="text-xl font-semibold text-white group-hover:text-blue-400 transition-colors">
                  {newFeedbackCount}
                </div>
                <div className="text-xs text-gray-400">New Feedback</div>
              </div>
            </Link>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default PendingNotificationsSummary;
