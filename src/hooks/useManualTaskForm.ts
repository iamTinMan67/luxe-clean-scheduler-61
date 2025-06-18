
import { useState, useMemo, useEffect } from 'react';
import { toast } from 'sonner';
import { Booking } from '@/types/booking';

interface TaskItem {
  id: string;
  description: string;
  hours: number;
  rate: number;
  cost: number;
}

interface CustomerData {
  customer: string;
  email: string;
  phone: string;
  location: string;
  jobDetails: string;
  notes: string;
  originalBookingId: string;
}

export const useManualTaskForm = () => {
  const [bookingDate, setBookingDate] = useState<Date | undefined>();
  const [timeSlot, setTimeSlot] = useState('');
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [travel, setTravel] = useState(0);
  const [other, setOther] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [customerData, setCustomerData] = useState<CustomerData | null>(null);

  // Check for pre-populated customer data on mount
  useEffect(() => {
    const storedCustomerData = localStorage.getItem('pendingCustomerData');
    if (storedCustomerData) {
      try {
        const parsedData = JSON.parse(storedCustomerData);
        setCustomerData(parsedData);
        // Clear the stored data after using it
        localStorage.removeItem('pendingCustomerData');
        
        // Show notification that customer data was loaded
        toast.success('Customer details loaded', {
          description: `Pre-populated with details for ${parsedData.customer}`,
          style: {
            background: '#16a34a',
            color: 'white',
            border: '1px solid #15803d'
          }
        });
      } catch (error) {
        console.error('Error parsing customer data:', error);
      }
    }
  }, []);

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
        customer: customerData?.customer || 'Manual Task',
        vehicle: 'Custom Job',
        packageType: 'custom',
        date: bookingDate,
        time: timeSlot,
        location: customerData?.location || 'To be determined',
        contact: customerData?.phone,
        email: customerData?.email,
        status: 'confirmed',
        totalPrice: total,
        notes: customerData?.notes ? `${customerData.notes}\n\nManual task with ${tasks.length} items:\n${tasks.map(t => `- ${t.description} (${t.hours}h @ £${t.rate}/h)`).join('\n')}` : `Manual task with ${tasks.length} items:\n${tasks.map(t => `- ${t.description} (${t.hours}h @ £${t.rate}/h)`).join('\n')}`,
        jobDetails: customerData?.jobDetails ? `${customerData.jobDetails}; ${tasks.map(t => t.description).join('; ')}` : tasks.map(t => t.description).join('; '),
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

      // If this was created from a pending "Other" booking, remove the original pending booking
      if (customerData?.originalBookingId) {
        const pendingBookings = JSON.parse(localStorage.getItem('bookings') || '[]');
        const filteredPendingBookings = pendingBookings.filter((booking: Booking) => booking.id !== customerData.originalBookingId);
        localStorage.setItem('bookings', JSON.stringify(filteredPendingBookings));
      }

      toast.success('Manual job created successfully!', {
        description: `Job scheduled for ${bookingDate.toDateString()} at ${timeSlot}${customerData ? ` for ${customerData.customer}` : ''}`,
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
      setCustomerData(null);

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
    isSubmitting,
    customerData
  };
};
