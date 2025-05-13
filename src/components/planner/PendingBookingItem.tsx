
import React, { useState, useEffect } from 'react';
import { format } from "date-fns";
import { Booking } from '@/types/booking';
import { Button } from "@/components/ui/button";
import { 
  Car, Clock, MapPin, User, CheckCircle2, AlertCircle, Mail, Phone
} from "lucide-react";
import StaffAllocationDialog from './StaffAllocationDialog';
import { packageOptions, additionalServices } from "@/data/servicePackageData";
import { calculateTotalBookingTime } from "@/utils/priceCalculator";

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
  const [showStaffDialog, setShowStaffDialog] = useState(false);
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

  const handleConfirmClick = () => {
    setShowStaffDialog(true);
  };

  const handleStaffConfirm = (booking: Booking, selectedStaff: string[], travelMinutes: number) => {
    onConfirm(booking.id, selectedStaff, travelMinutes);
  };

  const formatDuration = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours > 0 ? hours + 'h ' : ''}${mins > 0 ? mins + 'm' : hours === 0 ? '0m' : ''}`;
  };

  return (
    <div 
      key={booking.id}
      className={`rounded-lg p-4 border ${getBookingBackground(booking)}`}
    >
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-medium text-white">{booking.customer}</h3>
        <span className="text-xs text-gray-400">ID: {booking.id}</span>
      </div>
      
      <div className="space-y-2 mb-4">
        <div className="flex items-center text-gray-300">
          <Car className="w-4 h-4 mr-2 text-gold" />
          <span>
            {booking.vehicle} 
            {booking.vehicleReg && ` (${booking.vehicleReg})`} - 
            {booking.packageType} Package
          </span>
        </div>
        
        <div className="flex items-center text-gray-300">
          <Clock className="w-4 h-4 mr-2 text-gold" />
          <span>
            {booking.date instanceof Date 
              ? format(booking.date, "MMM dd, yyyy") 
              : "Date not available"} 
            at {booking.time || "Not specified"}
            {estimatedDuration > 0 && ` (Est. duration: ${formatDuration(estimatedDuration)})`}
          </span>
        </div>
        
        <div className="flex items-center text-gray-300">
          <MapPin className="w-4 h-4 mr-2 text-gold" />
          <span>{booking.location}</span>
        </div>

        <div className="flex items-center text-gray-300">
          <User className="w-4 h-4 mr-2 text-gold" />
          <span>{booking.notes || "No notes provided"}</span>
        </div>
        
        <div className="flex items-center text-gray-300">
          <Mail className="w-4 h-4 mr-2 text-gold" />
          <span>{booking.email || "No email provided"}</span>
        </div>
        
        <div className="flex items-center text-gray-300">
          <Phone className="w-4 h-4 mr-2 text-gold" />
          <span>{booking.contact || "No phone provided"}</span>
        </div>
        
        {/* Add vehicle condition indicator */}
        {booking.condition !== undefined && (
          <div className="flex items-center text-gray-300">
            <span className={`text-sm ${booking.condition < 5 ? "text-orange-400" : "text-green-400"}`}>
              Vehicle Condition: {booking.condition}/10
            </span>
          </div>
        )}

        {/* Show additional services if any */}
        {booking.additionalServices && booking.additionalServices.length > 0 && (
          <div className="mt-2 pt-2 border-t border-gray-800">
            <h4 className="text-sm font-medium text-gold mb-1">Additional Services:</h4>
            <ul className="text-sm text-gray-300">
              {Array.isArray(booking.additionalServices) && booking.additionalServices.map((serviceId, index) => {
                const service = additionalServices.find(s => s.id === serviceId);
                return service ? (
                  <li key={index} className="flex items-center">
                    <span className="mr-1">•</span> {service.name} 
                    {service.duration ? ` (${service.duration} mins)` : ''}
                  </li>
                ) : null;
              })}
            </ul>
          </div>
        )}
      </div>
      
      <div className="flex gap-2">
        <Button 
          onClick={handleConfirmClick}
          className="flex-1 bg-green-600 hover:bg-green-700 text-white"
          size="sm"
        >
          <CheckCircle2 className="w-4 h-4 mr-1" /> Confirm
        </Button>
        
        <Button 
          onClick={() => onCancel(booking.id)}
          className="flex-1 bg-red-600 hover:bg-red-700 text-white"
          variant="destructive"
          size="sm"
        >
          <AlertCircle className="w-4 h-4 mr-1" /> Cancel
        </Button>
      </div>

      <StaffAllocationDialog
        open={showStaffDialog}
        onClose={() => setShowStaffDialog(false)}
        booking={booking}
        onConfirm={handleStaffConfirm}
        estimatedDuration={estimatedDuration}
      />
    </div>
  );
};

export default PendingBookingItem;
