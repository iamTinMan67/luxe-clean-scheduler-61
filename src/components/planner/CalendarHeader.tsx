
import React from 'react';
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { PlannerViewType } from "@/hooks/usePlannerCalendar";
import { format } from "date-fns";
import DailySchedule from './DailySchedule';

interface CalendarHeaderProps {
  date: Date;
  view: PlannerViewType;
  navigatePrevious: () => void;
  navigateNext: () => void;
  navigateToday: () => void;
  setView: (view: PlannerViewType) => void;
  pendingBookingsCount: number;
}

const CalendarHeader = ({
  date,
  view,
  navigatePrevious,
  navigateNext,
  navigateToday,
  setView,
  pendingBookingsCount
}: CalendarHeaderProps) => {
  return (
    <Card className="bg-gray-900 border-gray-800">
      <CardHeader className="pb-0">
        <div className="flex justify-between items-center">
          <CardTitle className="text-white">Schedule</CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700"
              onClick={() => setView('daily')}
            >
              Daily
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700"
              onClick={() => setView('weekly')}
            >
              Weekly
            </Button>
          </div>
        </div>
        
        <div className="flex items-center justify-between mt-4">
          <Button 
            variant="outline" 
            size="sm"
            className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700"
            onClick={navigatePrevious}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
          </Button>
          
          <h3 className="text-white text-lg font-medium">
            {format(date, 'EEEE')}
            <br />
            <span className="text-gold">{format(date, 'MMM dd, yyyy')}</span>
          </h3>
          
          <Button
            variant="outline"
            size="sm"
            className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700"
            onClick={navigateNext}
          >
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <DailySchedule date={date} />
      </CardContent>
    </Card>
  );
};

export default CalendarHeader;
