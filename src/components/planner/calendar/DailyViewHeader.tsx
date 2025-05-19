
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
          {timeSlots.map(slot => (
            <div key={slot} className="w-[120px] text-center font-medium text-gold">
              {slot}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DailyViewHeader;
