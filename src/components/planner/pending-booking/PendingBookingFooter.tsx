
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Booking } from '@/types/booking';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import BookingActions from '../booking-item/BookingActions';

interface PendingBookingFooterProps {
  booking: Booking;
  isOtherJobType: boolean;
  onConfirm: (bookingId: string, selectedStaff: string[], travelMinutes: number) => void;
  onCancel: (bookingId: string) => void;
  estimatedDuration: number;
}

const PendingBookingFooter: React.FC<PendingBookingFooterProps> = ({
  booking,
  isOtherJobType,
  onConfirm,
  onCancel,
  estimatedDuration
}) => {
  const navigate = useNavigate();

  // Handle create full booking for "Other" job types
  const handleCreateFullBooking = () => {
    // Store customer details in localStorage to pre-populate the manual task generator
    const customerData = {
      customer: booking.customer,
      email: booking.email,
      phone: booking.contact,
      location: booking.location,
      jobDetails: booking.jobDetails,
      notes: booking.notes,
      originalBookingId: booking.id
    };
    
    localStorage.setItem('pendingCustomerData', JSON.stringify(customerData));
    navigate('/admin/manual-task-generator');
  };

  if (isOtherJobType) {
    return (
      <div className="flex gap-2">
        <Button
          onClick={handleCreateFullBooking}
          className="flex-1 bg-green-600 hover:bg-green-700 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Full Booking
        </Button>
        <Button
          onClick={() => onCancel(booking.id)}
          variant="destructive"
          className="px-4"
        >
          Cancel
        </Button>
      </div>
    );
  }

  return (
    <BookingActions 
      booking={booking}
      onConfirm={onConfirm}
      onCancel={onCancel}
      estimatedDuration={estimatedDuration}
    />
  );
};

export default PendingBookingFooter;
