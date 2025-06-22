
import React from 'react';
import { Booking } from '@/types/booking';
import { Clock, Car, Van, Briefcase, Package, FileText, Wrench } from 'lucide-react';
import BookingContactDetails from '../booking-item/BookingContactDetails';

interface PendingBookingContentProps {
  booking: Booking;
  estimatedDuration?: number;
}

const PendingBookingContent: React.FC<PendingBookingContentProps> = ({
  booking,
  estimatedDuration
}) => {
  // Function to get the appropriate icon based on job type
  const getJobTypeIcon = (jobType?: string) => {
    switch (jobType?.toLowerCase()) {
      case 'car':
        return <Car className="w-4 h-4 text-gray-400" />;
      case 'van':
        return <Van className="w-4 h-4 text-gray-400" />;
      case 'other':
        return <Wrench className="w-4 h-4 text-gray-400" />;
      default:
        return <Car className="w-4 h-4 text-gray-400" />; // Default fallback
    }
  };

  // Function to get job type display text
  const getJobTypeDisplay = (jobType?: string) => {
    if (!jobType) return null;
    
    switch (jobType.toLowerCase()) {
      case 'car':
        return 'Car Service';
      case 'van':
        return 'Van Service';
      case 'other':
        return 'Custom Service';
      default:
        return jobType;
    }
  };

  return (
    <div className="space-y-3">
      {/* Line 1: Date and Time */}
      <div className="flex items-center space-x-2">
        <Clock className="w-4 h-4 text-gray-400" />
        <span className="text-gray-300">
          {booking.date instanceof Date 
            ? booking.date.toLocaleDateString() 
            : new Date(booking.date).toLocaleDateString()} at {booking.time}
        </span>
      </div>
      
      {/* Line 2: Job Type (if available) */}
      {booking.jobType && (
        <div className="flex items-center space-x-2">
          {getJobTypeIcon(booking.jobType)}
          <span className="text-gray-300">{getJobTypeDisplay(booking.jobType)}</span>
        </div>
      )}
      
      {/* Line 3: Job Details (if available and different from vehicle) */}
      {booking.jobDetails && booking.jobDetails !== booking.vehicle && (
        <div className="flex items-center space-x-2">
          <Briefcase className="w-4 h-4 text-gray-400" />
          <span className="text-gray-300">{booking.jobDetails}</span>
        </div>
      )}
      
      {/* Line 4: Vehicle (if available and not already shown as job details) */}
      {booking.vehicle && booking.vehicle !== booking.jobDetails && (
        <div className="flex items-center space-x-2">
          <Car className="w-4 h-4 text-gray-400" />
          <span className="text-gray-300">{booking.vehicle}</span>
        </div>
      )}
      
      {/* Line 5: Package Selected */}
      <div className="flex items-center space-x-2">
        <Package className="w-4 h-4 text-gray-400" />
        <span className="text-gray-300">{booking.packageType}</span>
      </div>
      
      {/* Line 6: Notes */}
      {booking.notes && (
        <div className="flex items-start space-x-2">
          <FileText className="w-4 h-4 text-gray-400 mt-0.5" />
          <div className="text-gray-300 text-sm">
            <span className="font-medium">Notes: </span>
            {booking.notes}
          </div>
        </div>
      )}

      {/* Collapsible Contact Details */}
      <BookingContactDetails
        customer={booking.customer}
        location={booking.location}
        email={booking.email}
        contact={booking.contact}
        clientType={booking.clientType}
      />
    </div>
  );
};

export default PendingBookingContent;
