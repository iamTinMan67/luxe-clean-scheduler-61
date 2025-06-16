
import React, { useState, useEffect } from 'react';
import { Booking } from '@/types/booking';
import { packageOptions } from "@/data/servicePackageData";
import { additionalServices } from "@/data/servicePackageData";
import { calculateTotalBookingTime } from "@/utils/priceCalculator";
import { MapPin, Building, Home } from 'lucide-react';

// Import refactored components
import BookingJobDetails from './booking-item/BookingJobDetails';
import BookingContactDetails from './booking-item/BookingContactDetails';
import BookingAdditionalInfo from './booking-item/BookingAdditionalInfo';
import BookingActions from './booking-item/BookingActions';

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

  // Get package details
  const packageDetail = packageOptions.find(p => p.type === booking.packageType);
  
  // Get additional services details
  const additionalServiceDetails = booking.additionalServices && Array.isArray(booking.additionalServices) ? 
    booking.additionalServices.map(id => additionalServices.find(s => s.id === id)).filter(Boolean) : 
    [];

  // Get client category styling and components
  const getClientCategoryStyling = (type?: string) => {
    switch (type) {
      case "private":
        return "text-blue-400 border-blue-400";
      case "corporate":
        return "text-green-400 border-green-400";
      default:
        return "text-gray-400 border-gray-400";
    }
  };

  const getClientIcon = (type?: string) => {
    switch (type) {
      case "private":
        return <Home className="w-4 h-4 mr-1" />;
      case "corporate":
        return <Building className="w-4 h-4 mr-1" />;
      default:
        return null;
    }
  };

  const getClientLabel = (type?: string) => {
    switch (type) {
      case "private":
        return "Private";
      case "corporate":
        return "Commercial";
      default:
        return null;
    }
  };

  return (
    <div 
      key={booking.id}
      className={`rounded-lg p-4 border ${getBookingBackground(booking)} relative`}
    >
      {/* Top row with booking ID (hidden for pending) and client type */}
      <div className="flex justify-between items-start mb-3">
        {/* Only show booking ID if status is not pending */}
        {booking.status !== 'pending' && (
          <span className="text-xs text-gray-400">ID: {booking.id}</span>
        )}
        
        {/* Client Category in top right corner */}
        {booking.clientType && (
          <div className={`flex items-center px-2 py-1 rounded-full border text-xs ${getClientCategoryStyling(booking.clientType)}`}>
            {getClientIcon(booking.clientType)}
            <span>{getClientLabel(booking.clientType)}</span>
          </div>
        )}
      </div>
      
      <div className="space-y-4 mb-4">
        {/* Customer Name and Post Code */}
        <div className="space-y-2">
          <h3 className="text-lg font-medium text-white">{booking.customer}</h3>
          <div className="flex items-center text-gray-300">
            <MapPin className="w-4 h-4 mr-2 text-gold" />
            <span>{booking.location}</span>
          </div>
        </div>

        {/* Job Details with reordered information */}
        <BookingJobDetails 
          customer={booking.customer}
          packageType={booking.packageType}
          packageDetail={packageDetail}
          condition={booking.condition}
          date={booking.date}
          time={booking.time}
          notes={booking.notes}
          jobDetails={booking.jobDetails}
          estimatedDuration={estimatedDuration}
        />

        {/* Additional Services */}
        <BookingAdditionalInfo 
          additionalServices={additionalServiceDetails}
          secondVehicle={booking.secondVehicle}
          secondVehicleReg={booking.secondVehicleReg}
        />

        {/* Contact Details - Collapsible */}
        <BookingContactDetails 
          customer={booking.customer}
          location={booking.location}
          email={booking.email}
          contact={booking.contact}
          clientType={booking.clientType}
        />
      </div>
      
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
