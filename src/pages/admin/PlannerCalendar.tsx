
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { usePlannerCalendar } from "@/hooks/usePlannerCalendar";
import CalendarHeader from "@/components/planner/CalendarHeader";
import PlannerContent from "@/components/planner/PlannerContent";
import { Card } from "@/components/ui/card";
import { useBookings } from "@/hooks/useBookings";
import BookingsCalendar from "@/components/planner/BookingsCalendar";
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

  // Staff planner functionality
  const {
    pendingBookings: staffPendingBookings,
    confirmedBookings: staffConfirmedBookings,
    date: staffDate,
    setDate: setStaffDate,
    view: staffView,
    setView: setStaffView,
    getBookingsForDate,
    handleConfirmBooking: staffHandleConfirmBooking,
    handleDeleteBooking,
    handlePackageChange,
    handleReschedule,
    handleCompleteBooking,
    handleUpdateStatus
  } = useBookings();

  // Archived bookings functionality
  const { archivedBookings } = useArchivedBookings();

  return (
    <div className="min-h-screen bg-black pb-16" key={key}>
      <section className="relative py-8">
        <div className="container mx-auto px-4">
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
              
              {/* Staff Planner section */}
              <div className="mt-8">
                <h2 className="text-2xl font-bold text-white mb-4">Staff Planner</h2>
                <BookingsCalendar 
                  date={staffDate}
                  setDate={setStaffDate}
                  view={staffView as "daily" | "weekly"}
                  setView={setStaffView as (view: "daily" | "weekly") => void}
                  bookingsForDate={getBookingsForDate()}
                  onConfirmBooking={staffHandleConfirmBooking}
                  onCompleteBooking={handleCompleteBooking}
                  onDeleteBooking={handleDeleteBooking}
                  onPackageChange={handlePackageChange}
                  onReschedule={handleReschedule}
                  onUpdateStatus={handleUpdateStatus}
                />
              </div>
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
