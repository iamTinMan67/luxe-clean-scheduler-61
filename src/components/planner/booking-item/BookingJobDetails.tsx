
import React from 'react';
import { Clock, Package, Gauge, Calendar, StickyNote } from 'lucide-react';
import { format } from "date-fns";
import { PackageOption } from '@/lib/types';

interface BookingJobDetailsProps {
  customer: string;
  packageType: string;
  packageDetail?: PackageOption;
  condition?: number;
  date: Date | string;
  time?: string;
  notes?: string;
  jobDetails?: string;
  estimatedDuration: number;
}

const BookingJobDetails: React.FC<BookingJobDetailsProps> = ({
  customer,
  packageType,
  packageDetail,
  condition,
  date,
  time,
  notes,
  jobDetails,
  estimatedDuration
}) => {
  const formatDuration = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours > 0 ? hours + 'h ' : ''}${mins > 0 ? mins + 'm' : hours === 0 ? '0m' : ''}`;
  };

  return (
    <div className="space-y-3">
      {/* Customer Name - Prominent */}
      <h3 className="text-lg font-medium text-white">{customer}</h3>
      
      {/* Job Details */}
      {jobDetails && (
        <div className="flex items-center text-gray-300">
          <StickyNote className="w-4 h-4 mr-2 text-gold" />
          <span>Job: {jobDetails}</span>
        </div>
      )}
      
      {/* Package Information */}
      <div className="flex items-center text-gray-300">
        <Package className="w-4 h-4 mr-2 text-gold" />
        <span>
          {packageDetail ? 
            `${packageType} Package (£${packageDetail.basePrice})` : 
            `${packageType} Package`}
        </span>
      </div>

      {/* Vehicle Condition */}
      {condition !== undefined && (
        <div className="flex items-center text-gray-300">
          <Gauge className="w-4 h-4 mr-2 text-gold" />
          <span className={`${condition < 5 ? "text-orange-400" : "text-green-400"}`}>
            Vehicle Condition: {condition}/10
          </span>
        </div>
      )}

      {/* Date and Time */}
      <div className="flex items-center text-gray-300">
        <Calendar className="w-4 h-4 mr-2 text-gold" />
        <span>
          {date instanceof Date 
            ? format(date, "MMM dd, yyyy") 
            : "Date not available"} 
          at {time || "Not specified"}
        </span>
      </div>

      {/* Estimated Duration */}
      {estimatedDuration > 0 && (
        <div className="flex items-center text-gray-300">
          <Clock className="w-4 h-4 mr-2 text-gold" />
          <span>Duration: {formatDuration(estimatedDuration)}</span>
        </div>
      )}

      {/* Notes */}
      {notes && (
        <div className="flex items-start text-gray-300">
          <StickyNote className="w-4 h-4 mr-2 text-gold mt-0.5" />
          <span className="text-sm">{notes}</span>
        </div>
      )}
    </div>
  );
};

export default BookingJobDetails;
