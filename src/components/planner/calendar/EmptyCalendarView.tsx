
import React from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';

interface EmptyCalendarViewProps {
  view?: 'daily' | 'weekly' | 'monthly';
  message?: string;
}

const EmptyCalendarView: React.FC<EmptyCalendarViewProps> = ({ 
  view, 
  message = "No bookings scheduled" 
}) => {
  return (
    <div className="text-center py-6 text-gray-500">
      <CalendarIcon className="mx-auto h-10 w-10 text-gray-400 mb-2" />
      {view ? 
        `${message} for the selected ${view === 'weekly' ? 'week' : 'month'}` : 
        message
      }
    </div>
  );
};

export default EmptyCalendarView;
