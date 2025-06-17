
import React from 'react';
import { Booking } from '@/types/booking';
import { packageOptions } from "@/data/servicePackageData";
import { additionalServices } from "@/data/servicePackageData";
import { Building, Home, Clock, MapPin, User } from 'lucide-react';
import DeleteBookingButton from '@/components/admin/shared/DeleteBookingButton';

interface ConfirmedBookingItemProps {
  booking: Booking;
  getBookingBackground: (booking: Booking) => string;
}

const ConfirmedBookingItem: React.FC<ConfirmedBookingItemProps> = ({
  booking,
  getBookingBackground
}) => {
  // Get package details
  const packageDetail = packageOptions.find(p => p.type === booking.packageType);
  
  // Get additional services details
  const additionalServiceDetails = booking.additionalServices && Array.isArray(booking.additionalServices) ? 
    booking.additionalServices.map(id => additionalServices.find(s => s.id === id)).filter(Boolean) : 
    [];

  // Calculate estimated duration from package tasks
  const getEstimatedDuration = () => {
    if (packageDetail && packageDetail.tasks) {
      return packageDetail.tasks.reduce((total, task) => total + (task.duration || 0), 0);
    }
    return 0;
  };

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "text-green-400";
      case "in-progress":
        return "text-blue-400";
      case "inspecting":
        return "text-yellow-400";
      case "inspected":
        return "text-orange-400";
      case "finished":
        return "text-purple-400";
      default:
        return "text-gray-400";
    }
  };

  const estimatedDuration = getEstimatedDuration();

  return (
    <div 
      className={`rounded-lg p-4 border ${getBookingBackground(booking)} relative`}
    >
      {/* Delete Button */}
      <DeleteBookingButton booking={booking} />

      {/* Top row with booking ID and client type */}
      <div className="flex justify-between items-start mb-3">
        <span className="text-xs text-gray-400">ID: {booking.id}</span>
        
        {/* Client Category in top right corner */}
        {booking.clientType && (
          <div className={`flex items-center px-2 py-1 rounded-full border text-xs ${getClientCategoryStyling(booking.clientType)}`}>
            {getClientIcon(booking.clientType)}
            <span>{getClientLabel(booking.clientType)}</span>
          </div>
        )}
      </div>
      
      <div className="space-y-3">
        {/* Customer and Status */}
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-white flex items-center">
            <User className="w-4 h-4 mr-2" />
            {booking.customer}
          </h3>
          <span className={`text-sm font-medium capitalize ${getStatusColor(booking.status)}`}>
            {booking.status.replace('-', ' ')}
          </span>
        </div>

        {/* Service Package */}
        <div className="text-gold">
          <span className="font-medium">{booking.packageType}</span>
          {estimatedDuration > 0 && (
            <span className="text-sm text-gray-300 ml-2">
              ({estimatedDuration} mins)
            </span>
          )}
        </div>

        {/* Vehicle */}
        <div className="text-white">
          <span className="text-sm text-gray-400">Vehicle: </span>
          {booking.vehicle} {booking.vehicleReg && `(${booking.vehicleReg})`}
        </div>

        {/* Date and Time */}
        <div className="flex items-center text-white">
          <Clock className="w-4 h-4 mr-2" />
          <span className="text-sm">
            {booking.date instanceof Date ? booking.date.toLocaleDateString() : booking.date} at {booking.time}
          </span>
        </div>

        {/* Location */}
        <div className="flex items-center text-white">
          <MapPin className="w-4 h-4 mr-2" />
          <span className="text-sm">{booking.location}</span>
        </div>

        {/* Additional Services */}
        {additionalServiceDetails.length > 0 && (
          <div className="text-sm text-gray-300">
            <span className="text-gray-400">Additional: </span>
            {additionalServiceDetails.map(service => service?.name).join(', ')}
          </div>
        )}

        {/* Staff Assignment */}
        {booking.staff && booking.staff.length > 0 && (
          <div className="text-sm text-gray-300">
            <span className="text-gray-400">Assigned: </span>
            {booking.staff.join(', ')}
          </div>
        )}

        {/* Notes */}
        {booking.notes && (
          <div className="text-sm text-gray-300">
            <span className="text-gray-400">Notes: </span>
            {booking.notes}
          </div>
        )}
      </div>
    </div>
  );
};

export default ConfirmedBookingItem;
