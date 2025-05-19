import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { PlannerViewType } from "@/hooks/usePlannerCalendar";

interface CalendarHeaderProps {
  date: Date;
  view: PlannerViewType; 
  navigatePrevious: () => void;
  navigateNext: () => void;
  navigateToday: () => void;
  setView: (view: PlannerViewType) => void;
  pendingBookingsCount: number;
}

const CalendarHeader = ({
  date,
  pendingBookingsCount
}: CalendarHeaderProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-8 text-center"
    >
      <h1 className="text-3xl font-bold text-white">
        Planner <span className="text-gold">Calendar</span>
      </h1>
      <p className="text-gray-400">
        Manage bookings and staff schedules
      </p>
      
      {/* Keep the pending bookings count badge if count > 0 */}
      {pendingBookingsCount > 0 && (
        <div className="flex justify-center mt-4">
          <div className="px-3 py-1 rounded-full bg-amber-900/30 text-amber-400 border border-amber-700 text-xs font-medium">
            {pendingBookingsCount} pending bookings
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default CalendarHeader;
