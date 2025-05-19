
import React from 'react';

interface DailyViewHeaderProps {
  timeSlots: string[];
}

const DailyViewHeader: React.FC<DailyViewHeaderProps> = ({ timeSlots }) => {
  return (
    <div className="flex sticky top-0 bg-black/80 z-10 border-b border-gray-700 py-2">
      <div className="min-w-[80px] font-bold text-white">Time</div>
      <div className="flex-1 overflow-x-auto">
        <div className="flex min-w-max">
          {Array.from(new Set(timeSlots.map(slot => slot.split(':')[0]))).map(hour => (
            <div key={hour} className="w-[120px] text-center font-bold text-gold">
              {hour}:00
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DailyViewHeader;
