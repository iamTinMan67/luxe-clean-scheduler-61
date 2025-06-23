import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { usePlannerCalendar } from "@/hooks/usePlannerCalendar";
import CalendarHeader from "@/components/planner/CalendarHeader";
import PlannerContent from "@/components/planner/PlannerContent";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ArchivedBookingsView from "@/components/planner/ArchivedBookingsView";
import { useArchivedBookings } from "@/hooks/planner/useArchivedBookings";

const PlannerCalendar = () => {
  // Force re-render on mount to ensure latest data is loaded
  const [key, setKey] = useState(0);
  const [activeTab, setActiveTab] = useState<"calendar" | "archived">("calendar");

  useEffect(() => {
    // This will force the component to re-render on mount
    // which will reload all bookings from localStorage
    setKey(prev => prev + 1);
  }, []);

  const {
    date,
    setDate,
    view,
    setView,
    pendingBookings,
    confirmedBookings,
    schedule,
    navigatePrevious,
    navigateNext,
    navigateToday,
    handleConfirmBooking,
    handleCancelBooking,
    getBookingBackground,
    hasBookingsOnDate,
    checkTimeConflict,
    conflictCount
  } = usePlannerCalendar();

  // Archived bookings functionality
  const { archivedBookings } = useArchivedBookings();

  return (
    <div className="min-h-screen bg-black pb-16" key={key}>
      <section className="relative py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center mb-8">
            <Link 
              to="/admin/planning" 
              className="flex items-center space-x-2 text-yellow-400 hover:text-yellow-300 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Planning</span>
            </Link>
          </div>

          {/* Calendar header with navigation */}
          <CalendarHeader 
            date={date}
            view={view}
            setView={setView}
            pendingBookingsCount={pendingBookings.length}
          />
          
          {/* Main content with tabs for planner and archived jobs */}
          <Tabs 
            value={activeTab} 
            onValueChange={(value) => setActiveTab(value as "calendar" | "archived")}
            className="mt-6"
          >
            <TabsList className="bg-gray-800 border border-gray-700">
              <TabsTrigger value="calendar" className="data-[state=active]:bg-gold data-[state=active]:text-black">
                Calendar View
              </TabsTrigger>
              <TabsTrigger value="archived" className="data-[state=active]:bg-gold data-[state=active]:text-black">
                Archived Jobs ({archivedBookings.length})
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="calendar" className="mt-4">
              {/* Main planner content */}
              <PlannerContent
                date={date}
                setDate={setDate}
                view={view}
                setView={setView}
                pendingBookings={pendingBookings}
                confirmedBookings={confirmedBookings}
                schedule={schedule}
                handleConfirmBooking={handleConfirmBooking}
                handleCancelBooking={handleCancelBooking}
                getBookingBackground={getBookingBackground}
                hasBookingsOnDate={hasBookingsOnDate}
                checkTimeConflict={checkTimeConflict}
                navigatePrevious={navigatePrevious}
                navigateNext={navigateNext}
                navigateToday={navigateToday}
                conflictCount={conflictCount}
              />
            </TabsContent>
            
            <TabsContent value="archived" className="mt-4">
              <ArchivedBookingsView archivedBookings={archivedBookings} />
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  );
};

export default PlannerCalendar;
