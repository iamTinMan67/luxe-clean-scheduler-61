
import React, { useState, useEffect } from 'react';
import { Booking } from '@/types/booking';
import { packageOptions, additionalServices } from "@/data/servicePackageData";
import { calculateTotalBookingTime } from "@/utils/priceCalculator";
import DeleteBookingButton from '@/components/admin/shared/DeleteBookingButton';

// Import refactored components
import PendingBookingHeader from './pending-booking/PendingBookingHeader';
import PendingBookingContent from './pending-booking/PendingBookingContent';
import PendingBookingFooter from './pending-booking/PendingBookingFooter';

interface PendingBookingItemProps {
  booking: Booking;
  onConfirm: (bookingId: string, selectedStaff: string[], travelMinutes: number) => void;
  onCancel: (bookingId: string) => void;
  getBookingBackground: (booking: Booking) => string;
}

const PendingBookingItem: React.FC<PendingBookingItemProps> = ({
  booking,
  onConfirm,
  onCancel,
  getBookingBackground
}) => {
  const [estimatedDuration, setEstimatedDuration] = useState<number>(0);

  // Calculate estimated duration based on package and additional services
  useEffect(() => {
    if (booking) {
      // Find the package
      const packageOption = packageOptions.find(p => p.type === booking.packageType);
      
      if (packageOption) {
        // Get additional services if present
        let selectedAdditionalServices: any[] = [];
        if (booking.additionalServices && Array.isArray(booking.additionalServices)) {
          selectedAdditionalServices = booking.additionalServices.map(serviceId => {
            return additionalServices.find(s => s.id === serviceId) || 
                  { id: serviceId, name: "Unknown service", price: 0, duration: 0 };
          });
        }
        
        // Calculate total time
        const totalTime = calculateTotalBookingTime(
          packageOption.tasks, 
          selectedAdditionalServices
        );
        
        setEstimatedDuration(totalTime);
      }
    }
  }, [booking]);

  // Check if this is an "Other" job type booking
  const isOtherJobType = booking.packageType === 'other' || booking.jobType === 'other';

  return (
    <div 
      key={booking.id}
      className={`rounded-lg p-4 border ${getBookingBackground(booking)} relative`}
    >
      {/* Delete Button */}
      <DeleteBookingButton booking={booking} />

      {/* Header with booking ID and client type */}
      <PendingBookingHeader booking={booking} />
      
      {/* Main content area */}
      <PendingBookingContent 
        booking={booking}
        estimatedDuration={estimatedDuration}
      />
      
      {/* Footer with actions */}
      <PendingBookingFooter
        booking={booking}
        isOtherJobType={isOtherJobType}
        onConfirm={onConfirm}
        onCancel={onCancel}
        estimatedDuration={estimatedDuration}
      />
    </div>
  );
};

export default PendingBookingItem;
