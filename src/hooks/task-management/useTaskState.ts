
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { TodoTask } from '../useTaskManagement';
import { ServiceTaskItem } from "@/types/task";
import { Booking } from "@/types/booking";
import { toast } from 'sonner';

export const useTaskState = () => {
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
  // New state for tracking task progress
  const [taskProgress, setTaskProgress] = useState<{[bookingId: string]: number}>({}); 

  // Load task progress from localStorage
  useEffect(() => {
    const savedProgress = localStorage.getItem('taskProgress');
    if (savedProgress) {
      try {
        setTaskProgress(JSON.parse(savedProgress));
      } catch (e) {
        console.error("Failed to load task progress:", e);
        setTaskProgress({});
      }
    }
  }, []);

  // Save task progress to localStorage whenever it changes
  useEffect(() => {
    if (Object.keys(taskProgress).length > 0) {
      localStorage.setItem('taskProgress', JSON.stringify(taskProgress));
    }
  }, [taskProgress]);

  // Update task progress when service tasks change
  const updateTaskProgress = (bookingId: string, progress: number) => {
    setTaskProgress(prev => {
      const newProgress = {
        ...prev,
        [bookingId]: progress
      };
      return newProgress;
    });

    // If the booking is complete (100%), show a toast notification
    if (progress === 100) {
      toast.success(`Booking ${bookingId} is now complete!`);
    }
  };

  return {
    todos,
    setTodos,
    newTodo,
    setNewTodo,
    bookingIdFromUrl,
    selectedAppointment,
    setSelectedAppointment,
    currentBooking, 
    setCurrentBooking,
    serviceTasks,
    setServiceTasks,
    taskProgress,
    updateTaskProgress
  };
};
