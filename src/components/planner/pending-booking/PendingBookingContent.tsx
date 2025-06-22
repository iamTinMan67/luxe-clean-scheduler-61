
import React from 'react';
import { Booking } from '@/types/booking';
import { Clock, Car, Truck, Briefcase, Package, FileText, Wrench, Plus } from 'lucide-react';
import BookingContactDetails from '../booking-item/BookingContactDetails';
import { additionalServices } from "@/data/servicePackageData";

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
        return <Truck className="w-4 h-4 text-gray-400" />;
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

  // Function to get all additional services
  const getAllAdditionalServices = (serviceIds?: string[]) => {
    if (!serviceIds || serviceIds.length === 0) return [];
    
    return serviceIds.map(id => {
      const service = additionalServices.find(s => s.id === id);
      return service ? service.name : id;
    });
  };

  const additionalServicesList = getAllAdditionalServices(booking.additionalServices);

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
      
      {/* Line 2: Job Type (if available) with icon on right corner */}
      {booking.jobType && (
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {getJobTypeIcon(booking.jobType)}
            <span className="text-gray-300">{getJobTypeDisplay(booking.jobType)}</span>
          </div>
          {/* Job category icon on the right corner */}
          <div className="flex-shrink-0">
            {getJobTypeIcon(booking.jobType)}
          </div>
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
      
      {/* All Additional Services */}
      {additionalServicesList.length > 0 && (
        <div className="space-y-2">
          {additionalServicesList.map((serviceName, index) => (
            <div key={index} className="flex items-center space-x-2">
              <Plus className="w-4 h-4 text-blue-400" />
              <span className="text-blue-400">{serviceName}</span>
            </div>
          ))}
        </div>
      )}
      
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
