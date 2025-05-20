
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTaskManagement } from "@/hooks/useTaskManagement";
import BookingSelector from "@/components/admin/todo/BookingSelector";
import ServiceTaskList from "@/components/admin/todo/ServiceTaskList";
import TodoListComponent from "@/components/admin/todo/TodoListComponent";

const TodoList = () => {
  const {
    todos,
    newTodo,
    setNewTodo,
    selectedAppointment,
    setSelectedAppointment,
    currentBooking,
    serviceTasks,
    loading,
    appointments,
    handleAddTodo,
    handleCompleteTodo,
    handleDeleteTodo,
    handleUpdateTimeAllocation,
    handleToggleTaskCompletion,
    handleSetActualTime,
    handleSaveServiceProgress
  } = useTaskManagement();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container mx-auto py-12 px-4"
    >
      <h1 className="text-3xl font-bold text-white mb-6 text-center">Task Management</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
        {/* Service Tasks Section */}
        <div className="md:col-span-2">
          <Card className="bg-black/60 border-gold/30 mb-8">
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-white">
                <span>Service Tasks</span>
                <BookingSelector
                  value={selectedAppointment}
                  onChange={setSelectedAppointment}
                  appointments={appointments}
                  loading={loading}
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
                onSaveProgress={handleSaveServiceProgress}
              />
            </CardContent>
          </Card>
        </div>

        {/* Regular Todo List Section */}
        <div className="md:col-span-1">
          <Card className="bg-black/60 border-gold/30">
            <CardHeader>
              <CardTitle className="text-white">General Todo List</CardTitle>
            </CardHeader>
            <CardContent>
              <TodoListComponent
                todos={todos}
                newTodo={newTodo}
                onSetNewTodo={setNewTodo}
                onAddTodo={handleAddTodo}
                onCompleteTodo={handleCompleteTodo}
                onDeleteTodo={handleDeleteTodo}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  );
};

export default TodoList;
