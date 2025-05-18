
import React from 'react';
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tabs } from "@/components/ui/tabs";
import { PlannerViewType } from '@/hooks/usePlannerCalendar';

interface CalendarViewSelectorProps {
  view: PlannerViewType;
  onViewChange: (view: string) => void;
}

const CalendarViewSelector: React.FC<CalendarViewSelectorProps> = ({ view, onViewChange }) => {
  return (
    <Tabs defaultValue="daily" value={view} onValueChange={onViewChange}>
      <TabsList className="bg-black/60">
        <TabsTrigger value="daily">Daily</TabsTrigger>
        <TabsTrigger value="weekly">Weekly</TabsTrigger>
        <TabsTrigger value="monthly">Monthly</TabsTrigger>
      </TabsList>
    </Tabs>
  );
};

export default CalendarViewSelector;
