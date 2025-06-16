
import React, { useState, useEffect } from 'react';
import { Booking } from '@/types/booking';
import { packageOptions } from "@/data/servicePackageData";
import { additionalServices } from "@/data/servicePackageData";
import { calculateTotalBookingTime } from "@/utils/priceCalculator";

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

  return (
    <div 
      key={booking.id}
      className={`rounded-lg p-4 border ${getBookingBackground(booking)}`}
    >
      <div className="flex justify-between items-start mb-3">
        <span className="text-xs text-gray-400">ID: {booking.id}</span>
      </div>
      
      <div className="space-y-4 mb-4">
        {/* Job Details - Prominently displayed at top */}
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
