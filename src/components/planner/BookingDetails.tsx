
import React from 'react';
import { Booking } from '@/types/booking';
import { additionalServices } from '@/data/servicePackageData';
import { packageOptions } from '@/data/servicePackageData';
import { getStatusInfo } from '@/utils/statusUtils';

interface BookingDetailsProps {
  booking: Booking;
}

const BookingDetails: React.FC<BookingDetailsProps> = ({ booking }) => {
  // Get package details
  const packageDetail = packageOptions.find(p => p.type === booking.packageType);
  
  // Get additional services details
  const additionalServiceDetails = booking.additionalServices && Array.isArray(booking.additionalServices) ? 
    booking.additionalServices.map(id => additionalServices.find(s => s.id === id)).filter(Boolean) : 
    [];

  // Get status info
  const statusInfo = getStatusInfo(booking.status);

  return (
    <div className="space-y-1 text-sm">
      <p className="text-gray-300">Reference: <span className="text-white font-semibold">{booking.id}</span></p>
      <p className="text-gray-300">Vehicle: <span className="text-white">{booking.vehicle}</span></p>
      <p className="text-gray-300">Package: 
        <span className="text-white"> {booking.packageType} 
          {packageDetail && packageDetail.basePrice ? ` (£${packageDetail.basePrice})` : ''}
        </span>
      </p>
      <p className="text-gray-300">Location: <span className="text-white">{booking.location}</span></p>
      {booking.notes && <p className="text-gray-300">Notes: <span className="text-white">{booking.notes}</span></p>}
      <p className="text-gray-300">Status: 
        <span className={`ml-1 ${statusInfo.textColor}`}>
          {statusInfo.label}
        </span>
      </p>

      {/* Show additional services if any */}
      {additionalServiceDetails.length > 0 && (
        <div className="mt-2 pt-1 border-t border-gray-800">
          <p className="text-gray-300 mb-1">Additional Services:</p>
          <ul className="space-y-0.5 pl-3">
            {additionalServiceDetails.map((service, idx) => (
              <li key={idx} className="text-white">
                • {service?.name} {service?.price ? `(£${service.price})` : ''}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Show staff assignments if available */}
      {booking.staff && booking.staff.length > 0 && (
        <div className="mt-2 pt-1 border-t border-gray-800">
          <p className="text-gray-300 mb-1">Staff Assigned</p>
          <div className="flex flex-wrap gap-1">
            {booking.staff.map((staffMember, idx) => (
              <span key={idx} className="bg-gray-800 px-2 py-0.5 rounded-full text-white text-xs">
                {staffMember}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingDetails;
