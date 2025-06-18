
import { toast } from 'sonner';
import { Booking } from '@/types/booking';
import { TaskItem, CustomerData } from './useManualTaskFormState';

export const useManualTaskSubmission = () => {
  const handleSubmit = async (
    e: React.FormEvent,
    {
      bookingDate,
      timeSlot,
      tasks,
      total,
      customerData,
      setIsSubmitting,
      resetForm
    }: {
      bookingDate?: Date;
      timeSlot: string;
      tasks: TaskItem[];
      total: number;
      customerData: CustomerData | null;
      setIsSubmitting: (value: boolean) => void;
      resetForm: () => void;
    }
  ) => {
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
      resetForm();

    } catch (error) {
      console.error('Error creating manual job:', error);
      toast.error('Failed to create manual job. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    handleSubmit
  };
};
