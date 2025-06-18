
import React from 'react';
import { Booking } from '@/types/booking';
import { packageOptions, additionalServices } from "@/data/servicePackageData";
import BookingJobDetails from '../booking-item/BookingJobDetails';
import BookingContactDetails from '../booking-item/BookingContactDetails';
import BookingAdditionalInfo from '../booking-item/BookingAdditionalInfo';

interface PendingBookingContentProps {
  booking: Booking;
  estimatedDuration: number;
}

const PendingBookingContent: React.FC<PendingBookingContentProps> = ({ 
  booking, 
  estimatedDuration 
}) => {
  // Get package details
  const packageDetail = packageOptions.find(p => p.type === booking.packageType);
  
  // Get additional services details
  const additionalServiceDetails = booking.additionalServices && Array.isArray(booking.additionalServices) ? 
    booking.additionalServices.map(id => additionalServices.find(s => s.id === id)).filter(Boolean) : 
    [];

  return (
    <div className="space-y-4 mb-4">
      {/* Job Details - Now prominent at the top without customer name */}
      <BookingJobDetails 
        customer=""
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

      {/* Contact Details - Now includes customer name and location */}
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
