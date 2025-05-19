
import React from 'react';
import { Booking } from '@/types/booking';
import BookingMetadata from './booking-details/BookingMetadata';
import AdditionalServices from './booking-details/AdditionalServices';
import BookingActions from './booking-details/BookingActions';
import { useBookingDuration } from '@/hooks/planner/useBookingDuration';

interface PendingBookingItemProps {
  booking: Booking;
  onConfirm: (bookingId: string, selectedStaff: string[], travelMinutes: number) => void;
  onCancel: (bookingId: string) => void;
  getBookingBackground: (booking: Booking) => string;
  showMinimal?: boolean;
}

const PendingBookingItem: React.FC<PendingBookingItemProps> = ({
  booking,
  onConfirm,
  onCancel,
  getBookingBackground,
  showMinimal = false
}) => {
  const estimatedDuration = useBookingDuration(booking);

  return (
    <div 
      className={`rounded-lg p-4 border ${getBookingBackground(booking)}`}
    >
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-medium text-white">{booking.customer}</h3>
        <span className="text-xs text-gray-400">{showMinimal ? '' : 'ID: '}{booking.id}</span>
      </div>
      
      {/* Display metadata based on minimal or full view */}
      <BookingMetadata 
        booking={booking} 
        estimatedDuration={estimatedDuration}
        showMinimal={showMinimal} 
      />
      
      {/* Show additional services if any - Only in full view */}
      {!showMinimal && (
        <AdditionalServices serviceIds={booking.additionalServices} />
      )}
      
      {/* Action buttons */}
      <BookingActions 
        booking={booking}
        onConfirm={onConfirm}
        onCancel={onCancel}
        estimatedDuration={estimatedDuration}
      />
    </div>
  );
};

export default PendingBookingItem;
