
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

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

export const useManualTaskFormState = () => {
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

  const resetForm = () => {
    setBookingDate(undefined);
    setTimeSlot('');
    setTasks([]);
    setTravel(0);
    setOther(0);
    setCustomerData(null);
  };

  return {
    bookingDate,
    setBookingDate,
    timeSlot,
    setTimeSlot,
    tasks,
    setTasks,
    travel,
    setTravel,
    other,
    setOther,
    isSubmitting,
    setIsSubmitting,
    customerData,
    resetForm
  };
};

export type { TaskItem, CustomerData };
