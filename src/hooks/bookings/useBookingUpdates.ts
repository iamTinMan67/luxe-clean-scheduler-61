
import { Booking } from '@/types/booking';
import { generateInvoice, sendNotification } from '@/utils/bookingUtils';
import { toast } from 'sonner';

export const useBookingUpdates = (
  pendingBookings: Booking[],
  setPendingBookings: React.Dispatch<React.SetStateAction<Booking[]>>,
  confirmedBookings: Booking[],
  setConfirmedBookings: React.Dispatch<React.SetStateAction<Booking[]>>
) => {
  // Handle package change
  const handlePackageChange = (booking: Booking, newPackageType: string) => {
    if (!newPackageType) return;
    
    // Update the booking
    const updatedBooking: Booking = {
      ...booking,
      packageType: newPackageType
    };
    
    // Update in the appropriate list
    if (updatedBooking.status === "pending") {
      const updatedPendingBookings = pendingBookings.map(b => 
        b.id === updatedBooking.id ? updatedBooking : b
      );
      setPendingBookings(updatedPendingBookings);
      localStorage.setItem('pendingBookings', JSON.stringify(updatedPendingBookings));
    } else {
      const updatedConfirmedBookings = confirmedBookings.map(b => 
        b.id === updatedBooking.id ? updatedBooking : b
      );
      setConfirmedBookings(updatedConfirmedBookings);
      localStorage.setItem('confirmedBookings', JSON.stringify(updatedConfirmedBookings));
    }
    
    // Generate new invoice if it's a confirmed booking
    if (updatedBooking.status === "confirmed") {
      // Remove old invoice
      const existingInvoices = localStorage.getItem('invoices') 
        ? JSON.parse(localStorage.getItem('invoices') || '[]') 
        : [];
      
      const filteredInvoices = existingInvoices.filter((inv: any) => inv.id !== updatedBooking.id);
      localStorage.setItem('invoices', JSON.stringify(filteredInvoices));
      
      // Generate new invoice
      generateInvoice(updatedBooking);
      
      // Send notification
      sendNotification(updatedBooking, "update");
    }
    
    toast.success("Package updated", {
      description: `Package updated to ${newPackageType} for ${updatedBooking.customer}`
    });
  };
  
  // Handle date reschedule
  const handleReschedule = (booking: Booking, rescheduledDate: Date) => {
    if (!rescheduledDate) return;
    
    // Update the booking
    const updatedBooking: Booking = {
      ...booking,
      date: rescheduledDate
    };
    
    // Update in the appropriate list
    if (updatedBooking.status === "pending") {
      const updatedPendingBookings = pendingBookings.map(b => 
        b.id === updatedBooking.id ? updatedBooking : b
      );
      setPendingBookings(updatedPendingBookings);
      localStorage.setItem('pendingBookings', JSON.stringify(updatedPendingBookings));
    } else {
      const updatedConfirmedBookings = confirmedBookings.map(b => 
        b.id === updatedBooking.id ? updatedBooking : b
      );
      setConfirmedBookings(updatedConfirmedBookings);
      localStorage.setItem('confirmedBookings', JSON.stringify(updatedConfirmedBookings));
    }
    
    // Send notification if confirmed
    if (updatedBooking.status === "confirmed") {
      sendNotification(updatedBooking, "update");
    }
    
    toast.success("Booking rescheduled", {
      description: `Booking rescheduled to ${rescheduledDate.toLocaleDateString()} for ${updatedBooking.customer}`
    });
  };

  return {
    handlePackageChange,
    handleReschedule
  };
};
