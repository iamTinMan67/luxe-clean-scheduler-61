
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { 
  ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight 
} from "lucide-react";
import { PlannerViewType } from "@/hooks/usePlannerCalendar";

interface CalendarHeaderProps {
  date: Date;
  view: PlannerViewType; // Updated to use PlannerViewType
  navigatePrevious: () => void;
  navigateNext: () => void;
  navigateToday: () => void;
  setView: (view: PlannerViewType) => void; // Updated to use PlannerViewType
  pendingBookingsCount: number;
}

const CalendarHeader = ({
  date,
  view,
  navigatePrevious,
  navigateNext,
  navigateToday,
  setView,
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
      
      <div className="flex flex-col md:flex-row justify-between items-center mt-4 gap-4">
        <div className="px-3 py-1 rounded-full bg-amber-900/30 text-amber-400 border border-amber-700 text-xs font-medium">
          {pendingBookingsCount} pending bookings
        </div>
        
        <div className="flex items-center gap-2">
          <div className="flex items-center rounded-md border border-gray-800 mr-2">
            <Button
              variant="ghost"
              className={`text-white hover:text-gold ${view === 'daily' ? 'bg-gray-800' : ''}`}
              onClick={() => setView('daily')}
            >
              Daily
            </Button>
            <Button
              variant="ghost"
              className={`text-white hover:text-gold ${view === 'weekly' ? 'bg-gray-800' : ''}`}
              onClick={() => setView('weekly')}
            >
              Weekly
            </Button>
            <Button
              variant="ghost"
              className={`text-white hover:text-gold ${view === 'monthly' ? 'bg-gray-800' : ''}`}
              onClick={() => setView('monthly')}
            >
              Monthly
            </Button>
          </div>
          
          <div className="flex">
            <Button 
              variant="outline" 
              size="icon"
              className="rounded-r-none border-gray-800 text-white hover:text-gold"
              onClick={navigatePrevious}
            >
              {view === 'daily' ? <ChevronLeft className="h-4 w-4" /> : <ChevronsLeft className="h-4 w-4" />}
            </Button>
            <Button
              variant="outline"
              className="rounded-none border-l-0 border-r-0 border-gray-800 text-white"
              onClick={navigateToday}
            >
              Today
            </Button>
            <Button 
              variant="outline" 
              size="icon"
              className="rounded-l-none border-gray-800 text-white hover:text-gold"
              onClick={navigateNext}
            >
              {view === 'daily' ? <ChevronRight className="h-4 w-4" /> : <ChevronsRight className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CalendarHeader;
