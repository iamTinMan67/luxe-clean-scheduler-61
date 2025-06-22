
import React from 'react';
import { Booking } from '@/types/booking';
import BookingHeader from './BookingHeader';
import BookingMetadata from './BookingMetadata';
import BookingTimeInfo from './BookingTimeInfo';
import BookingJobInfo from './BookingJobInfo';
import BookingContactDetails from '../booking-item/BookingContactDetails';

interface BookingCardProps {
  booking: Booking;
  backgroundClass: string;
  onReschedule: (booking: Booking, newDate: Date, newTime?: string) => void;
  onDelete: (booking: Booking) => void;
}

const BookingCard: React.FC<BookingCardProps> = ({ 
  booking, 
  backgroundClass, 
  onReschedule, 
  onDelete 
}) => {
  return (
    <div className={`rounded-lg p-4 border-l-4 ${backgroundClass} bg-gray-900/50 backdrop-blur-sm`}>
      <BookingHeader 
        booking={booking}
        onReschedule={onReschedule}
        onDelete={onDelete}
      />

      <BookingMetadata 
        clientType={booking.clientType}
        jobType={booking.jobType}
      />
      
      <div className="text-gray-300 text-sm mb-2 font-medium">
        {booking.vehicle || "No vehicle info"}
        {booking.packageType && booking.packageType !== "TBC" && (
          <span className="ml-2 px-2 py-1 bg-gold/20 text-gold rounded text-xs">
            {booking.packageType} Package
          </span>
        )}
      </div>
      
      <BookingTimeInfo 
        startTime={booking.startTime}
        time={booking.time}
        endTime={booking.endTime}
      />

      <BookingJobInfo 
        jobDetails={booking.jobDetails}
        notes={booking.notes}
      />
      
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

export default BookingCard;
