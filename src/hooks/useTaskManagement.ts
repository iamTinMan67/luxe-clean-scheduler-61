import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { useScheduledAppointments } from "@/hooks/useScheduledAppointments";
import { Booking } from "@/types/booking";
import { ServiceTaskItem } from "@/types/task";

export const useTaskManagement = () => {
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

  // Calculate total time for current booking tasks
  const calculateTotalBookingTime = () => {
    if (!serviceTasks.length) return 0;
    
    return serviceTasks.reduce((total, task) => total + task.allocatedTime, 0);
  };
  
  // Calculate remaining time based on completed tasks
  const calculateRemainingTime = () => {
    const totalTime = calculateTotalBookingTime();
    const completedTime = serviceTasks
      .filter(task => task.completed)
      .reduce((total, task) => total + task.allocatedTime, 0);
      
    return totalTime - completedTime;
  };
  
  // Add new functions to the return object
  return {
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
    handleSaveServiceProgress,
    calculateTotalBookingTime,
    calculateRemainingTime
  };
};

export interface TodoTask {
  id: number;
  text: string;
  completed: boolean;
}

// Import required from data/packageData
import { packageOptions, additionalServices } from "@/data/servicePackageData";
