
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { TodoTask } from '../useTaskManagement';
import { ServiceTaskItem } from "@/types/task";
import { Booking } from "@/types/booking";

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
    setServiceTasks
  };
};
