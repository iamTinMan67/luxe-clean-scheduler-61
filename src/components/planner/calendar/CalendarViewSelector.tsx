
import React from 'react';
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tabs } from "@/components/ui/tabs";
import { CalendarDays, Calendar as CalendarIcon, ListTodo } from 'lucide-react';
import { PlannerViewType } from '@/hooks/usePlannerCalendar';

interface CalendarViewSelectorProps {
  view: PlannerViewType;
  onViewChange: (view: string) => void;
}

const CalendarViewSelector: React.FC<CalendarViewSelectorProps> = ({ view, onViewChange }) => {
  return (
    <Tabs defaultValue="daily" value={view} onValueChange={onViewChange}>
      <TabsList className="bg-black/60">
        <TabsTrigger value="daily" className="flex items-center gap-1">
          <ListTodo className="h-4 w-4" />
          <span>Daily</span>
        </TabsTrigger>
        <TabsTrigger value="weekly" className="flex items-center gap-1">
          <CalendarIcon className="h-4 w-4" />
          <span>Weekly</span>
        </TabsTrigger>
        <TabsTrigger value="monthly" className="flex items-center gap-1">
          <CalendarDays className="h-4 w-4" />
          <span>Monthly</span>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};

export default CalendarViewSelector;
