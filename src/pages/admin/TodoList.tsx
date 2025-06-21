import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTaskManagement } from "@/hooks/useTaskManagement";
import EnhancedBookingSelector from "@/components/admin/todo/EnhancedBookingSelector";
import ServiceTaskList from "@/components/admin/todo/ServiceTaskList";
import AfterPhotosSection from "@/components/admin/todo/AfterPhotosSection";

const TodoList = () => {
  const {
    selectedAppointment,
    setSelectedAppointment,
    currentBooking,
    serviceTasks,
    loading,
    appointments,
    selectedDate,
    setSelectedDate,
    searchTerm,
    setSearchTerm,
    handleUpdateTimeAllocation,
    handleToggleTaskCompletion,
    handleSetActualTime,
    handleFinishJob
  } = useTaskManagement();

  // Check if all tasks are completed (job is finished)
  const isJobFinished = serviceTasks.length > 0 && serviceTasks.every(task => task.completed);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container mx-auto py-12 px-4"
    >
      <div className="flex items-center mb-8">
        <Link 
          to="/admin/planning" 
          className="flex items-center space-x-2 text-yellow-400 hover:text-yellow-300 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Planning</span>
        </Link>
      </div>

      <h1 className="text-3xl font-bold text-white mb-6 text-center">Task Management</h1>

      <div className="max-w-6xl mx-auto space-y-6">
        <Card className="bg-black/60 border-gold/30">
          <CardHeader>
            <CardTitle className="flex flex-col space-y-4 text-white">
              <span>Service Tasks</span>
              <EnhancedBookingSelector
                value={selectedAppointment}
                onChange={setSelectedAppointment}
                appointments={appointments}
                loading={loading}
                selectedDate={selectedDate}
                onDateChange={setSelectedDate}
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
              />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ServiceTaskList
              currentBooking={currentBooking}
              serviceTasks={serviceTasks}
              onToggleTask={handleToggleTaskCompletion}
              onUpdateTimeAllocation={handleUpdateTimeAllocation}
              onSetActualTime={handleSetActualTime}
              onFinishJob={handleFinishJob}
            />
          </CardContent>
        </Card>

        {/* After Photos Section - Only show when job is finished and booking is selected */}
        {currentBooking && isJobFinished && (
          <AfterPhotosSection 
            bookingId={currentBooking.id}
            isJobFinished={isJobFinished}
          />
        )}
      </div>
    </motion.div>
  );
};

export default TodoList;
