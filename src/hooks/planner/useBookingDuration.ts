
import { useState, useEffect } from 'react';
import { Booking } from '@/types/booking';
import { packageOptions, additionalServices } from "@/data/servicePackageData";
import { calculateTotalBookingTime } from "@/utils/priceCalculator";

export const useBookingDuration = (booking: Booking) => {
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

  return estimatedDuration;
};
