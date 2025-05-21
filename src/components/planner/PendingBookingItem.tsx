
import React, { useState, useEffect } from 'react';
import { format } from "date-fns";
import { Booking } from '@/types/booking';
import { Button } from "@/components/ui/button";
import { 
  Car, Clock, MapPin, User, CheckCircle2, AlertCircle, Mail, Phone, Package, CalendarClock,
  ChevronDown, ChevronUp
} from "lucide-react";
import StaffAllocationDialog from './StaffAllocationDialog';
import RescheduleDialog from './dialogs/RescheduleDialog';
import { packageOptions } from "@/data/servicePackageData";
import { additionalServices } from "@/data/servicePackageData";
import { calculateTotalBookingTime } from "@/utils/priceCalculator";
import { staffMembers } from "@/data/staffData";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

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
  const [isContactDetailsOpen, setIsContactDetailsOpen] = useState(false);

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

  // Handle rescheduling
  const handleReschedule = (booking: Booking, newDate: Date, newTime?: string) => {
    // This would typically update the booking in a real implementation
    console.log("Booking rescheduled:", booking.id, newDate, newTime);
    // For now, we'll just log it since we don't have a direct reschedule function passed down
  };

  // Get default staff (first two staff members)
  const defaultStaff = staffMembers.slice(0, 2).map(staff => staff.name);
  
  const handleConfirmClick = () => {
    // If there are more than 2 staff members, show the dialog
    if (staffMembers.length > 2) {
      setShowStaffDialog(true);
    } else {
      // Otherwise, directly confirm with the default staff
      onConfirm(booking.id, defaultStaff, 15);
    }
  };

  const handleStaffConfirm = (booking: Booking, selectedStaff: string[], travelMinutes: number) => {
    onConfirm(booking.id, selectedStaff, travelMinutes);
  };

  const formatDuration = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours > 0 ? hours + 'h ' : ''}${mins > 0 ? mins + 'm' : hours === 0 ? '0m' : ''}`;
  };

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
        <h3 className="text-lg font-medium text-white">{booking.customer}</h3>
        <span className="text-xs text-gray-400">ID: {booking.id}</span>
      </div>
      
      <div className="space-y-2 mb-4">
        <div className="flex items-center text-gray-300">
          <Car className="w-4 h-4 mr-2 text-gold" />
          <span>{booking.vehicle}</span>
        </div>

        <div className="flex items-center text-gray-300">
          <Package className="w-4 h-4 mr-2 text-gold" />
          <span>
            {packageDetail ? 
              `${booking.packageType} Package (£${packageDetail.basePrice})` : 
              `${booking.packageType} Package`}
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

        {/* Contact information collapsible section */}
        <Collapsible 
          open={isContactDetailsOpen} 
          onOpenChange={setIsContactDetailsOpen}
          className="mt-2"
        >
          <CollapsibleTrigger className="flex w-full items-center justify-between py-2 text-sm text-gray-400 hover:text-white">
            <span>Contact Details</span>
            {isContactDetailsOpen ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-2 pt-2">
            {/* Add location/postcode to contact details */}
            <div className="flex items-center text-gray-300">
              <MapPin className="w-4 h-4 mr-2 text-gold" />
              <span>{booking.location}</span>
            </div>
            
            {booking.notes && (
              <div className="flex items-center text-gray-300">
                <User className="w-4 h-4 mr-2 text-gold" />
                <span>{booking.notes}</span>
              </div>
            )}
            
            {booking.email && (
              <div className="flex items-center text-gray-300">
                <Mail className="w-4 h-4 mr-2 text-gold" />
                <span>{booking.email}</span>
              </div>
            )}
            
            {booking.contact && (
              <div className="flex items-center text-gray-300">
                <Phone className="w-4 h-4 mr-2 text-gold" />
                <span>{booking.contact}</span>
              </div>
            )}
            
            {/* Add vehicle registration if available */}
            {booking.vehicleReg && (
              <div className="flex items-center text-gray-300">
                <Car className="w-4 h-4 mr-2 text-gold" />
                <span>Reg: {booking.vehicleReg}</span>
              </div>
            )}
            
            {/* Add vehicle condition indicator */}
            {booking.condition !== undefined && (
              <div className="flex items-center text-gray-300">
                <span className={`text-sm ${booking.condition < 5 ? "text-orange-400" : "text-green-400"}`}>
                  Vehicle Condition: {booking.condition}/10
                </span>
              </div>
            )}
          </CollapsibleContent>
        </Collapsible>

        {/* Show additional services if any */}
        {additionalServiceDetails.length > 0 && (
          <div className="mt-2 pt-2 border-t border-gray-800">
            <h4 className="text-sm font-medium text-gold mb-1">Additional Services:</h4>
            <ul className="text-sm text-gray-300">
              {additionalServiceDetails.map((service, index) => (
                <li key={index} className="flex items-center">
                  <span className="mr-1">•</span> {service?.name} 
                  {service?.price ? ` (£${service.price})` : ''} 
                  {service?.duration ? ` (${service.duration} mins)` : ''}
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {/* Display second vehicle details if available */}
        {booking.secondVehicle && (
          <div className="mt-2 pt-2 border-t border-gray-800">
            <h4 className="text-sm font-medium text-gold mb-1">Second Vehicle:</h4>
            <div className="text-sm text-gray-300 flex items-center">
              <Car className="w-3 h-3 mr-1 text-gold" />
              <span>{booking.secondVehicle}</span>
              {booking.secondVehicleReg && 
                <span className="ml-1 text-xs text-gray-400">(Reg: {booking.secondVehicleReg})</span>
              }
            </div>
          </div>
        )}
      </div>
      
      <div className="flex gap-2">
        <Button 
          onClick={handleConfirmClick}
          className="flex-1 bg-green-600 hover:bg-green-700 text-white"
          size="sm"
        >
          <CheckCircle2 className="w-4 h-4 mr-1" /> Schedule
        </Button>
        
        {/* Add Reschedule Button */}
        <RescheduleDialog 
          booking={booking}
          onReschedule={handleReschedule}
        />
        
        <Button 
          onClick={() => onCancel(booking.id)}
          className="flex-1 bg-red-600 hover:bg-red-700 text-white"
          variant="destructive"
          size="sm"
        >
          <AlertCircle className="w-4 h-4 mr-1" /> Decline
        </Button>
      </div>

      {/* Only show staff dialog if there are more than 2 staff members */}
      {staffMembers.length > 2 && (
        <StaffAllocationDialog
          open={showStaffDialog}
          onClose={() => setShowStaffDialog(false)}
          booking={booking}
          onConfirm={handleStaffConfirm}
          estimatedDuration={estimatedDuration}
          defaultStaff={defaultStaff}
        />
      )}
    </div>
  );
};

export default PendingBookingItem;
