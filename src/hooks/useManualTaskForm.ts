
import { useState, useMemo } from 'react';
import { toast } from 'sonner';
import { Booking } from '@/types/booking';

interface TaskItem {
  id: string;
  description: string;
  hours: number;
  rate: number;
  cost: number;
}

export const useManualTaskForm = () => {
  const [bookingDate, setBookingDate] = useState<Date | undefined>();
  const [timeSlot, setTimeSlot] = useState('');
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [travel, setTravel] = useState(0);
  const [other, setOther] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Calculate subtotal from tasks
  const subtotal = useMemo(() => {
    return tasks.reduce((sum, task) => sum + task.cost, 0);
  }, [tasks]);

  // Calculate total
  const total = useMemo(() => {
    return subtotal + travel + other;
  }, [subtotal, travel, other]);

  const addTask = () => {
    const newTask: TaskItem = {
      id: `task-${Date.now()}`,
      description: '',
      hours: 0,
      rate: 0,
      cost: 0
    };
    setTasks([...tasks, newTask]);
  };

  const updateTask = (id: string, field: keyof TaskItem, value: string | number) => {
    setTasks(tasks.map(task => {
      if (task.id === id) {
        const updatedTask = { ...task, [field]: value };
        // Recalculate cost when hours or rate changes
        if (field === 'hours' || field === 'rate') {
          updatedTask.cost = updatedTask.hours * updatedTask.rate;
        }
        return updatedTask;
      }
      return task;
    }));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const moveTaskUp = (index: number) => {
    if (index > 0) {
      const newTasks = [...tasks];
      [newTasks[index], newTasks[index - 1]] = [newTasks[index - 1], newTasks[index]];
      setTasks(newTasks);
    }
  };

  const moveTaskDown = (index: number) => {
    if (index < tasks.length - 1) {
      const newTasks = [...tasks];
      [newTasks[index], newTasks[index + 1]] = [newTasks[index + 1], newTasks[index]];
      setTasks(newTasks);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!bookingDate || !timeSlot || tasks.length === 0) {
      toast.error('Please fill in all required fields and add at least one task');
      return;
    }

    // Validate tasks
    const invalidTasks = tasks.filter(task => !task.description.trim() || task.hours <= 0 || task.rate <= 0);
    if (invalidTasks.length > 0) {
      toast.error('Please ensure all tasks have a description, hours, and rate greater than 0');
      return;
    }

    setIsSubmitting(true);

    try {
      // Create a manual booking entry
      const manualBooking: Booking = {
        id: `manual-${Date.now()}`,
        customer: 'Manual Task',
        vehicle: 'Custom Job',
        packageType: 'custom',
        date: bookingDate,
        time: timeSlot,
        location: 'To be determined',
        status: 'confirmed',
        totalPrice: total,
        notes: `Manual task with ${tasks.length} items:\n${tasks.map(t => `- ${t.description} (${t.hours}h @ £${t.rate}/h)`).join('\n')}`,
        jobDetails: tasks.map(t => t.description).join('; '),
        clientType: 'private',
        jobType: 'other',
        staff: ['Admin'],
        travelMinutes: 0
      };

      // Save to confirmed bookings
      const existingBookings = JSON.parse(localStorage.getItem('confirmedBookings') || '[]');
      const updatedBookings = [...existingBookings, manualBooking];
      localStorage.setItem('confirmedBookings', JSON.stringify(updatedBookings));

      // Also save to planner calendar bookings
      const plannerBookings = JSON.parse(localStorage.getItem('plannerCalendarBookings') || '[]');
      localStorage.setItem('plannerCalendarBookings', JSON.stringify([...plannerBookings, manualBooking]));

      toast.success('Manual job created successfully!', {
        description: `Job scheduled for ${bookingDate.toDateString()} at ${timeSlot}`,
        style: {
          background: '#f97316',
          color: 'white',
          border: '1px solid #ea580c'
        }
      });

      // Reset form
      setBookingDate(undefined);
      setTimeSlot('');
      setTasks([]);
      setTravel(0);
      setOther(0);

    } catch (error) {
      console.error('Error creating manual job:', error);
      toast.error('Failed to create manual job. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    bookingDate,
    setBookingDate,
    timeSlot,
    setTimeSlot,
    tasks,
    addTask,
    updateTask,
    deleteTask,
    moveTaskUp,
    moveTaskDown,
    subtotal,
    travel,
    setTravel,
    other,
    setOther,
    total,
    handleSubmit,
    isSubmitting
  };
};
