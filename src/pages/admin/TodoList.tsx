
import { motion } from "framer-motion";
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Clock, CalendarClock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useScheduledAppointments } from "@/hooks/useScheduledAppointments";
import { Booking } from "@/types/booking";
import { packageOptions } from "@/data/servicePackageData";
import { additionalServices } from "@/data/servicePackageData";

interface ServiceTaskItem {
  id: string;
  name: string;
  completed: boolean;
  allocatedTime: number; // in minutes
  actualTime?: number; // in minutes
}

interface TodoTask {
  id: number;
  text: string;
  completed: boolean;
}

const TodoList = () => {
  const [todos, setTodos] = useState<TodoTask[]>([
    { id: 1, text: 'Learn React', completed: false },
    { id: 2, text: 'Build a Todo App', completed: true },
    { id: 3, text: 'Deploy the App', completed: false },
  ]);
  
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const bookingIdFromUrl = queryParams.get('bookingId');
  
  const [newTodo, setNewTodo] = useState('');
  const [selectedAppointment, setSelectedAppointment] = useState<string>("");
  const [currentBooking, setCurrentBooking] = useState<Booking | null>(null);
  const [serviceTasks, setServiceTasks] = useState<ServiceTaskItem[]>([]);
  const { appointments, loading } = useScheduledAppointments();
  const { toast } = useToast();

  // Auto-select the booking from URL if available
  useEffect(() => {
    if (bookingIdFromUrl && appointments.length > 0) {
      const booking = appointments.find(app => app.id === bookingIdFromUrl);
      if (booking) {
        setSelectedAppointment(bookingIdFromUrl);
      }
    }
  }, [bookingIdFromUrl, appointments]);

  // Handle adding a regular todo
  const handleAddTodo = () => {
    if (newTodo.trim() !== '') {
      setTodos([...todos, { id: Date.now(), text: newTodo, completed: false }]);
      setNewTodo('');
    }
  };

  // Handle completing a regular todo
  const handleCompleteTodo = (id: number) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  // Handle deleting a regular todo
  const handleDeleteTodo = (id: number) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  // Handle appointment selection
  useEffect(() => {
    if (selectedAppointment) {
      const booking = appointments.find(app => app.id === selectedAppointment);
      if (booking) {
        setCurrentBooking(booking);
        generateServiceTasksFromPackage(booking);
      }
    } else {
      setCurrentBooking(null);
      setServiceTasks([]);
    }
  }, [selectedAppointment, appointments]);

  // Generate service tasks based on the selected package and additional services
  const generateServiceTasksFromPackage = (booking: Booking) => {
    const tasks: ServiceTaskItem[] = [];
    
    // Find the package details
    const packageDetail = packageOptions.find(p => p.type === booking.packageType);
    
    // Add tasks from the selected package
    if (packageDetail && packageDetail.tasks) {
      packageDetail.tasks.forEach(task => {
        tasks.push({
          id: `${task.id}-${Date.now()}`,
          name: task.name,
          completed: false,
          allocatedTime: task.duration
        });
      });
    }
    
    // Add tasks from additional services if any
    if (booking.additionalServices && booking.additionalServices.length > 0) {
      booking.additionalServices.forEach(serviceId => {
        const service = additionalServices.find(s => s.id === serviceId);
        if (service) {
          tasks.push({
            id: `${service.id}-${Date.now()}`,
            name: service.name,
            completed: false,
            allocatedTime: service.duration || 30 // Default to 30 minutes if not specified
          });
        }
      });
    }
    
    // Load any previously saved progress
    const savedProgress = JSON.parse(localStorage.getItem('serviceProgress') || '[]');
    const existingProgress = savedProgress.find((p: any) => p.bookingId === booking.id);
    
    if (existingProgress) {
      // Merge saved progress with newly generated tasks
      const mergedTasks = tasks.map(task => {
        const savedTask = existingProgress.tasks.find((t: any) => t.name === task.name);
        return savedTask ? { ...task, ...savedTask } : task;
      });
      
      setServiceTasks(mergedTasks);
    } else {
      setServiceTasks(tasks);
    }
  };

  // Handle updating time allocation
  const handleUpdateTimeAllocation = (taskId: string, newTime: number) => {
    setServiceTasks(
      serviceTasks.map(task => 
        task.id === taskId ? { ...task, allocatedTime: newTime } : task
      )
    );
  };

  // Handle toggling task completion
  const handleToggleTaskCompletion = (taskId: string) => {
    setServiceTasks(
      serviceTasks.map(task => 
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
    
    // Auto-save progress after each change
    saveServiceProgress();
  };

  // Handle setting actual time spent
  const handleSetActualTime = (taskId: string, time: number) => {
    setServiceTasks(
      serviceTasks.map(task => 
        task.id === taskId ? { ...task, actualTime: time } : task
      )
    );
    
    // Auto-save progress after each change
    saveServiceProgress();
  };

  // Handle saving service progress
  const saveServiceProgress = () => {
    if (!currentBooking) return;

    // Check if all tasks are completed
    const allTasksCompleted = serviceTasks.every(task => task.completed);
    const newStatus = allTasksCompleted ? "completed" : "in-progress";
    
    // Update booking status in localStorage
    const confirmedBookings = JSON.parse(localStorage.getItem('confirmedBookings') || '[]');
    const updatedBookings = confirmedBookings.map((booking: Booking) => {
      if (booking.id === currentBooking.id) {
        return {
          ...booking,
          status: newStatus
        };
      }
      return booking;
    });
    
    localStorage.setItem('confirmedBookings', JSON.stringify(updatedBookings));
    
    // Also update in planner calendar bookings if it exists there
    const plannerBookings = JSON.parse(localStorage.getItem('plannerCalendarBookings') || '[]');
    const updatedPlannerBookings = plannerBookings.map((booking: Booking) => {
      if (booking.id === currentBooking.id) {
        return {
          ...booking,
          status: newStatus
        };
      }
      return booking;
    });
    
    localStorage.setItem('plannerCalendarBookings', JSON.stringify(updatedPlannerBookings));
    
    // Save service tasks progress to localStorage
    const serviceProgress = {
      bookingId: currentBooking.id,
      tasks: serviceTasks,
      lastUpdated: new Date().toISOString()
    };
    
    const savedProgress = JSON.parse(localStorage.getItem('serviceProgress') || '[]');
    const existingProgressIndex = savedProgress.findIndex((p: any) => p.bookingId === currentBooking.id);
    
    if (existingProgressIndex >= 0) {
      savedProgress[existingProgressIndex] = serviceProgress;
    } else {
      savedProgress.push(serviceProgress);
    }
    
    localStorage.setItem('serviceProgress', JSON.stringify(savedProgress));
    
    // Update progress percentage for Track My Valet feature
    updateTrackingProgress(currentBooking.id, serviceTasks);
  };
  
  // Update tracking progress for the customer-facing progress page
  const updateTrackingProgress = (bookingId: string, tasks: ServiceTaskItem[]) => {
    const completedTasks = tasks.filter(task => task.completed).length;
    const totalTasks = tasks.length;
    const progressPercentage = Math.round((completedTasks / totalTasks) * 100);
    
    // Update booking progress
    const confirmedBookings = JSON.parse(localStorage.getItem('confirmedBookings') || '[]');
    const updatedBookings = confirmedBookings.map((booking: Booking) => {
      if (booking.id === bookingId) {
        return {
          ...booking,
          progressPercentage: progressPercentage
        };
      }
      return booking;
    });
    
    localStorage.setItem('confirmedBookings', JSON.stringify(updatedBookings));
    
    // Map tasks to booking steps for the progress page
    const bookingSteps = tasks.map((task, index) => ({
      id: index + 1,
      name: task.name,
      completed: task.completed,
      time: task.completed ? new Date().toISOString() : undefined,
      estimatedTime: `${task.allocatedTime} minutes`
    }));
    
    // Store steps for the progress tracking page
    const progressData = {
      bookingId,
      steps: bookingSteps,
      updatedAt: new Date().toISOString()
    };
    
    const savedProgressData = JSON.parse(localStorage.getItem('bookingProgressData') || '[]');
    const existingDataIndex = savedProgressData.findIndex((p: any) => p.bookingId === bookingId);
    
    if (existingDataIndex >= 0) {
      savedProgressData[existingDataIndex] = progressData;
    } else {
      savedProgressData.push(progressData);
    }
    
    localStorage.setItem('bookingProgressData', JSON.stringify(savedProgressData));
  };

  const handleSaveServiceProgress = () => {
    saveServiceProgress();
    toast({
      title: "Service progress saved",
      description: `All progress has been saved and tracking is updated`,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container mx-auto py-12 px-4"
    >
      <h1 className="text-3xl font-bold text-white mb-6">Task Management</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Service Tasks Section */}
        <div className="md:col-span-2">
          <Card className="bg-black/60 border-gold/30 mb-8">
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-white">
                <span>Service Tasks</span>
                <Select value={selectedAppointment} onValueChange={setSelectedAppointment}>
                  <SelectTrigger className="w-[240px] bg-black/50 border-gold/30">
                    <SelectValue placeholder="Select an appointment" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 border-gold/30 text-white">
                    {loading ? (
                      <SelectItem value="loading" disabled>Loading appointments...</SelectItem>
                    ) : appointments.length > 0 ? (
                      appointments.map((booking) => (
                        <SelectItem key={booking.id} value={booking.id}>
                          {booking.customer} - {booking.vehicle}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="none" disabled>No appointments found</SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {currentBooking ? (
                <div>
                  <div className="mb-4 p-4 border border-gold/20 rounded-md bg-black/40">
                    <div className="flex justify-between mb-2">
                      <span className="text-white font-semibold">{currentBooking.customer}</span>
                      <span className="text-gold">{currentBooking.packageType} Package</span>
                    </div>
                    <div className="text-sm text-gray-400">
                      <p>Vehicle: {currentBooking.vehicle} {currentBooking.vehicleReg ? `(${currentBooking.vehicleReg})` : ''}</p>
                      <p>Location: {currentBooking.location}</p>
                      <p>Date: {new Date(currentBooking.date).toLocaleDateString()} {currentBooking.time}</p>
                    </div>
                  </div>

                  {serviceTasks.length > 0 ? (
                    <div>
                      <div className="grid grid-cols-12 gap-2 mb-2 text-sm font-medium text-gray-400 px-1">
                        <div className="col-span-5">Task</div>
                        <div className="col-span-2 text-center">Status</div>
                        <div className="col-span-2 text-center">Allocated</div>
                        <div className="col-span-3 text-center">Actual Time</div>
                      </div>
                      
                      <ul className="space-y-2">
                        {serviceTasks.map((task) => (
                          <li key={task.id} className="flex items-center border border-gray-800 p-3 rounded-md bg-gray-900/30">
                            <div className="grid grid-cols-12 gap-2 w-full items-center">
                              <div className="col-span-5 flex items-center">
                                <Checkbox
                                  id={`task-${task.id}`}
                                  checked={task.completed}
                                  onCheckedChange={() => handleToggleTaskCompletion(task.id)}
                                  className="mr-3 border-gold/50"
                                />
                                <label
                                  htmlFor={`task-${task.id}`}
                                  className={`${task.completed ? 'line-through text-gray-500' : 'text-white'}`}
                                >
                                  {task.name}
                                </label>
                              </div>
                              
                              <div className="col-span-2 text-center">
                                <span className={`px-2 py-1 rounded text-xs ${
                                  task.completed 
                                    ? 'bg-green-900/40 text-green-400' 
                                    : 'bg-amber-900/40 text-amber-400'
                                }`}>
                                  {task.completed ? 'Completed' : 'Pending'}
                                </span>
                              </div>
                              
                              <div className="col-span-2">
                                <div className="flex items-center justify-center">
                                  <Input
                                    type="number"
                                    min="1"
                                    value={task.allocatedTime}
                                    onChange={(e) => handleUpdateTimeAllocation(task.id, parseInt(e.target.value) || task.allocatedTime)}
                                    className="w-16 text-center bg-black/70 border-gray-700 text-white"
                                  />
                                  <span className="ml-1 text-gray-400">min</span>
                                </div>
                              </div>
                              
                              <div className="col-span-3">
                                <div className="flex items-center justify-center">
                                  <Input
                                    type="number"
                                    min="1"
                                    value={task.actualTime || ''}
                                    placeholder="-"
                                    onChange={(e) => handleSetActualTime(task.id, parseInt(e.target.value) || 0)}
                                    className="w-16 text-center bg-black/70 border-gray-700 text-white"
                                  />
                                  <span className="ml-1 text-gray-400">min</span>
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="ml-1 text-gold hover:text-gold/80"
                                    onClick={() => handleSetActualTime(task.id, task.allocatedTime)}
                                  >
                                    <Clock className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                      
                      <div className="mt-6 flex justify-end">
                        <Button 
                          onClick={handleSaveServiceProgress} 
                          className="gold-gradient text-black"
                        >
                          Update Service Progress
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="py-12 text-center">
                      <CalendarClock className="mx-auto h-12 w-12 text-gray-500 mb-4" />
                      <p className="text-gray-400">No service tasks found for this booking.</p>
                      <p className="text-gray-500 text-sm mt-1">This may happen if package details are missing.</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="py-12 text-center">
                  <CalendarClock className="mx-auto h-12 w-12 text-gray-500 mb-4" />
                  <p className="text-gray-400">Select an appointment to view service tasks</p>
                </div>
              )}
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
              <div className="flex items-center space-x-2 mb-4">
                <Input
                  type="text"
                  placeholder="Add a new task"
                  className="bg-black/70 text-white border-gold/50 focus-visible:ring-gold/50"
                  value={newTodo}
                  onChange={(e) => setNewTodo(e.target.value)}
                />
                <Button onClick={handleAddTodo} className="gold-gradient text-black">Add</Button>
              </div>

              <ul>
                {todos.map((todo) => (
                  <li key={todo.id} className="flex items-center justify-between py-2 border-b border-gold/30">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={`todo-${todo.id}`}
                        checked={todo.completed}
                        onCheckedChange={() => handleCompleteTodo(todo.id)}
                        className="ring-gold/50 focus-visible:ring-gold/50"
                      />
                      <label
                        htmlFor={`todo-${todo.id}`}
                        className={`text-white ${todo.completed ? 'line-through text-gray-400' : ''}`}
                      >
                        {todo.text}
                      </label>
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteTodo(todo.id)}
                    >
                      Delete
                    </Button>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  );
};

export default TodoList;
