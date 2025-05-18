
import { useState, useEffect } from 'react';
import { Booking } from '@/types/booking';
import { useBookingsStorage } from './planner/useBookingsStorage';
import { PlannerViewType } from './usePlannerCalendar';
import { toast } from 'sonner';
import { useBookingManagement } from './planner/useBookingManagement';
import { isSameDay } from 'date-fns';

export const useBookings = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [view, setView] = useState<PlannerViewType>('daily');
  
  const { 
    pendingBookings, 
    setPendingBookings, 
    confirmedBookings, 
    setConfirmedBookings 
  } = useBookingsStorage();
  
  const { 
    handleConfirmBooking: confirmBooking, 
    handleCancelBooking: deleteBooking,
    getBookingBackground
  } = useBookingManagement(pendingBookings, setPendingBookings, confirmedBookings, setConfirmedBookings);
  
  // Get bookings for the selected date
  const getBookingsForDate = () => {
    if (!date) return [];
    
    return [...confirmedBookings, ...pendingBookings].filter(booking => {
      const bookingDate = booking.date instanceof Date ? booking.date : new Date(booking.date);
      return isSameDay(bookingDate, date);
    }).sort((a, b) => {
      // Sort by time
      const timeA = a.startTime || a.time || '00:00';
      const timeB = b.startTime || b.time || '00:00';
      return timeA.localeCompare(timeB);
    });
  };
  
  // Handler for confirming a booking
  const handleConfirmBooking = (booking: Booking) => {
    // Update booking status to confirmed
    const updatedBooking = {
      ...booking,
      status: 'confirmed' as const
    };
    
    // Default staff assignment if not already assigned
    if (!updatedBooking.staff || updatedBooking.staff.length === 0) {
      updatedBooking.staff = ['Staff1', 'Staff2'];
    }
    
    // Default travel time if not set
    if (!updatedBooking.travelMinutes) {
      updatedBooking.travelMinutes = 15; // Default 15 min travel time
    }
    
    // Remove from pending and add to confirmed
    const updatedPending = pendingBookings.filter(b => b.id !== booking.id);
    setPendingBookings(updatedPending);
    
    const updatedConfirmed = [...confirmedBookings, updatedBooking];
    setConfirmedBookings(updatedConfirmed);
    
    // Save to localStorage
    localStorage.setItem('pendingBookings', JSON.stringify(updatedPending));
    localStorage.setItem('confirmedBookings', JSON.stringify(updatedConfirmed));
    
    toast.success(`${booking.customer}'s booking has been confirmed.`);
  };
  
  // Handler for completing a booking
  const handleCompleteBooking = (booking: Booking) => {
    // Update booking status to completed
    const completedBooking = {
      ...booking,
      status: 'completed' as const
    };
    
    // Update the confirmed bookings list
    const updatedConfirmed = confirmedBookings.map(b => 
      b.id === booking.id ? completedBooking : b
    );
    
    setConfirmedBookings(updatedConfirmed);
    
    // Save to localStorage
    localStorage.setItem('confirmedBookings', JSON.stringify(updatedConfirmed));
    
    toast.success(`${booking.customer}'s booking has been marked as completed.`);
  };
  
  // Handler for updating booking status
  const handleUpdateStatus = (booking: Booking, newStatus: "confirmed" | "in-progress" | "completed" | "finished") => {
    // If the booking is pending and we're confirming it, use the confirmation handler
    if (booking.status === "pending" && newStatus === "confirmed") {
      handleConfirmBooking(booking);
      return;
    }
    
    // Find the list containing the booking
    const isConfirmed = confirmedBookings.some(b => b.id === booking.id);
    const isPending = pendingBookings.some(b => b.id === booking.id);
    
    if (isConfirmed) {
      // Update in confirmed bookings
      const updatedConfirmed = confirmedBookings.map(b => 
        b.id === booking.id ? { ...b, status: newStatus } : b
      );
      
      setConfirmedBookings(updatedConfirmed);
      localStorage.setItem('confirmedBookings', JSON.stringify(updatedConfirmed));
      
      // If status is finished, trigger invoice generation
      if (newStatus === "finished") {
        // Generate invoice
        generateInvoice(booking);
      }
      
      // If status is in-progress, populate To-Do list
      if (newStatus === "in-progress") {
        populateToDoList(booking);
      }
    } else if (isPending) {
      // Update in pending bookings
      const updatedPending = pendingBookings.map(b => 
        b.id === booking.id ? { ...b, status: newStatus } : b
      );
      
      setPendingBookings(updatedPending);
      localStorage.setItem('pendingBookings', JSON.stringify(updatedPending));
    }
    
    toast.success(`${booking.customer}'s booking has been updated to ${newStatus}.`);
  };
  
  // Helper function to generate an invoice
  const generateInvoice = (booking: Booking) => {
    // Import the utility function
    const { generateInvoice } = require('@/utils/bookingUtils');
    generateInvoice(booking);
    
    toast.success(`Invoice generated for ${booking.customer}.`);
  };
  
  // Helper function to populate To-Do list
  const populateToDoList = (booking: Booking) => {
    // Find the package
    const packageData = require('@/data/servicePackageData');
    const packageOption = packageData.packageOptions.find(p => p.type === booking.packageType);
    
    if (packageOption) {
      // Create service tasks
      const serviceTasks = packageOption.tasks.map(task => ({
        id: `${task.id}-${booking.id}`,
        name: task.name,
        completed: false,
        allocatedTime: task.duration,
        appointment_id: booking.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }));
      
      // Add additional services if present
      if (booking.additionalServices && Array.isArray(booking.additionalServices)) {
        booking.additionalServices.forEach(serviceId => {
          const service = packageData.additionalServices.find(s => s.id === serviceId);
          if (service) {
            serviceTasks.push({
              id: `${service.id}-${booking.id}`,
              name: service.name,
              completed: false,
              allocatedTime: service.duration || 30, // Default 30 mins
              appointment_id: booking.id,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            });
          }
        });
      }
      
      // Save to localStorage
      const existingTasks = JSON.parse(localStorage.getItem('serviceTasks') || '[]');
      localStorage.setItem('serviceTasks', JSON.stringify([...existingTasks, ...serviceTasks]));
      
      toast.success(`${serviceTasks.length} tasks added to the To-Do list.`);
    }
  };
  
  // Handler for deleting a booking
  const handleDeleteBooking = (booking: Booking) => {
    deleteBooking(booking.id);
    
    toast.success(`${booking.customer}'s booking has been deleted.`);
  };
  
  // Handler for changing a package
  const handlePackageChange = (booking: Booking, newPackage: string) => {
    const isConfirmed = booking.status === 'confirmed' || booking.status === 'in-progress' || booking.status === 'completed';
    
    if (isConfirmed) {
      // Update in confirmed bookings
      const updatedConfirmed = confirmedBookings.map(b => 
        b.id === booking.id ? { ...b, packageType: newPackage } : b
      );
      
      setConfirmedBookings(updatedConfirmed);
      localStorage.setItem('confirmedBookings', JSON.stringify(updatedConfirmed));
    } else {
      // Update in pending bookings
      const updatedPending = pendingBookings.map(b => 
        b.id === booking.id ? { ...b, packageType: newPackage } : b
      );
      
      setPendingBookings(updatedPending);
      localStorage.setItem('pendingBookings', JSON.stringify(updatedPending));
    }
    
    toast.success(`${booking.customer}'s package has been updated to ${newPackage}.`);
  };
  
  // Handler for rescheduling a booking
  const handleReschedule = (booking: Booking, newDate: Date) => {
    const isConfirmed = booking.status === 'confirmed' || booking.status === 'in-progress' || booking.status === 'completed';
    
    if (isConfirmed) {
      // Update in confirmed bookings
      const updatedConfirmed = confirmedBookings.map(b => 
        b.id === booking.id ? { ...b, date: newDate } : b
      );
      
      setConfirmedBookings(updatedConfirmed);
      localStorage.setItem('confirmedBookings', JSON.stringify(updatedConfirmed));
    } else {
      // Update in pending bookings
      const updatedPending = pendingBookings.map(b => 
        b.id === booking.id ? { ...b, date: newDate } : b
      );
      
      setPendingBookings(updatedPending);
      localStorage.setItem('pendingBookings', JSON.stringify(updatedPending));
    }
    
    // Update the selected date to the rescheduled date
    setDate(newDate);
    
    toast.success(`${booking.customer}'s booking has been rescheduled to ${newDate.toLocaleDateString()}.`);
  };
  
  return {
    pendingBookings,
    confirmedBookings,
    date,
    setDate,
    view,
    setView,
    getBookingsForDate,
    handleConfirmBooking,
    handleDeleteBooking,
    handlePackageChange,
    handleReschedule,
    handleCompleteBooking,
    handleUpdateStatus,
    getBookingBackground
  };
};
