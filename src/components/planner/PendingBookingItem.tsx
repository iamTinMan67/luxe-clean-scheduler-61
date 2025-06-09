
import React, { useState, useEffect } from 'react';
import { Booking } from '@/types/booking';
import { packageOptions } from "@/data/servicePackageData";
import { additionalServices } from "@/data/servicePackageData";
import { calculateTotalBookingTime } from "@/utils/priceCalculator";
import { Building, Home, Car, Truck, Box } from "lucide-react";

// Import refactored components
import BookingVehicleInfo from './booking-item/BookingVehicleInfo';
import BookingDateTimeInfo from './booking-item/BookingDateTimeInfo';
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

  // Helper function to get client icon
  const getClientIcon = (clientType?: string) => {
    switch (clientType) {
      case "private":
        return <Home size={16} className="text-blue-400" />;
      case "corporate":
        return <Building size={16} className="text-green-400" />;
      default:
        return <Home size={16} className="text-gray-400" />;
    }
  };

  // Helper function to get job type icon
  const getJobTypeIcon = (vehicleType?: string) => {
    switch (vehicleType) {
      case "car":
        return <Car size={16} className="text-gray-300" />;
      case "van":
        return <Truck size={16} className="text-gray-300" />;
      case "other":
        return <Box size={16} className="text-gray-300" />;
      default:
        return <Car size={16} className="text-gray-300" />;
    }
  };

  return (
    <div 
      key={booking.id}
      className={`rounded-lg p-4 border ${getBookingBackground(booking)}`}
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex flex-col">
          <h3 className="text-lg font-medium text-white">{booking.customer}</h3>
          {/* Category indicators */}
          <div className="flex items-center gap-3 mt-1">
            {booking.clientType && (
              <div className="flex items-center gap-1">
                {getClientIcon(booking.clientType)}
                <span className="text-xs text-gray-300 capitalize">{booking.clientType}</span>
              </div>
            )}
            {booking.vehicleType && (
              <div className="flex items-center gap-1">
                {getJobTypeIcon(booking.vehicleType)}
                <span className="text-xs text-gray-300 capitalize">{booking.vehicleType}</span>
              </div>
            )}
          </div>
        </div>
        <span className="text-xs text-gray-400">ID: {booking.id}</span>
      </div>
      
      <div className="space-y-2 mb-4">
        <BookingVehicleInfo 
          vehicle={booking.vehicle}
          packageType={booking.packageType}
          packageDetail={packageDetail}
        />

        <BookingDateTimeInfo 
          date={booking.date}
          time={booking.time}
          estimatedDuration={estimatedDuration}
        />

        <BookingContactDetails 
          location={booking.location}
          notes={booking.notes}
          email={booking.email}
          contact={booking.contact}
          jobDetails={booking.jobDetails}
          condition={booking.condition}
          clientType={booking.clientType}
          vehicleType={booking.vehicleType}
        />

        <BookingAdditionalInfo 
          additionalServices={additionalServiceDetails}
          secondVehicle={booking.secondVehicle}
          secondVehicleReg={booking.secondVehicleReg}
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
