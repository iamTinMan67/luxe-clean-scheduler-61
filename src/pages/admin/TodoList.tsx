
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTaskManagement } from "@/hooks/useTaskManagement";
import EnhancedBookingSelector from "@/components/admin/todo/EnhancedBookingSelector";
import ServiceTaskList from "@/components/admin/todo/ServiceTaskList";

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
    handleSetActualTime
  } = useTaskManagement();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container mx-auto py-12 px-4"
    >
      <h1 className="text-3xl font-bold text-white mb-6 text-center">Task Management</h1>

      <div className="max-w-6xl mx-auto">
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
            />
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
};

export default TodoList;
