
import { motion } from "framer-motion";
import { PlannerViewType } from "@/hooks/usePlannerCalendar";

interface CalendarHeaderProps {
  date: Date;
  view: PlannerViewType;
  setView: (view: PlannerViewType) => void;
  pendingBookingsCount: number;
}

const CalendarHeader = ({
  date,
  view,
  setView,
}: CalendarHeaderProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-4 text-center"
    >
      <h1 className="text-3xl font-bold text-white">
        Planner <span className="text-gold">Calendar</span>
      </h1>
      <p className="text-gray-400">
        Manage bookings and staff schedules
      </p>
    </motion.div>
  );
};

export default CalendarHeader;
