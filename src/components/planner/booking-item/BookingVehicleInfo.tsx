
import React from 'react';
import { Car, Package } from 'lucide-react';
import { PackageOption } from '@/lib/types';

interface BookingVehicleInfoProps {
  vehicle: string;
  packageType: string;
  packageDetail: PackageOption | undefined;
}

const BookingVehicleInfo: React.FC<BookingVehicleInfoProps> = ({
  vehicle,
  packageType,
  packageDetail
}) => {
  return (
    <>
      <div className="flex items-center text-gray-300">
        <Car className="w-4 h-4 mr-2 text-gold" />
        <span>{vehicle}</span>
      </div>

      <div className="flex items-center text-gray-300">
        <Package className="w-4 h-4 mr-2 text-gold" />
        <span>
          {packageDetail ? 
            `${packageType} Package (£${packageDetail.basePrice})` : 
            `${packageType} Package`}
        </span>
      </div>
    </>
  );
};

export default BookingVehicleInfo;
