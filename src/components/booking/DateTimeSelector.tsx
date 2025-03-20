
import { useState } from "react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";

interface DateTimeSelectorProps {
  date: Date | undefined;
  time: string;
  onDateChange: (date: Date | undefined) => void;
  onTimeChange: (time: string) => void;
}

const DateTimeSelector = ({ 
  date, 
  time, 
  onDateChange, 
  onTimeChange 
}: DateTimeSelectorProps) => {
  const timeSlots = [
    "08:00", "09:00", "10:00", "11:00", "12:00",
    "13:00", "14:00", "15:00", "16:00", "17:00"
  ];

  return (
    <>
      <div className="mb-6">
        <Calendar
          mode="single"
          selected={date}
          onSelect={onDateChange}
          className="bg-gray-900 border border-gray-800 rounded-md p-4"
          classNames={{
            day_selected: "bg-gold text-black",
            day_today: "bg-gray-800 text-white",
            day: "text-white hover:bg-gray-800"
          }}
          disabled={(date) => {
            // Disable past dates and Sundays
            const now = new Date();
            now.setHours(0, 0, 0, 0);
            return date < now || date.getDay() === 0;
          }}
        />
      </div>
      
      {date && (
        <div>
          <h3 className="text-lg font-medium text-white mb-3">
            Available Times for {format(date, "EEEE, MMMM d, yyyy")}
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {timeSlots.map((slot) => (
              <button
                key={slot}
                type="button"
                className={`py-2 px-3 rounded-md text-sm transition-colors ${
                  time === slot
                    ? "gold-gradient text-black"
                    : "bg-gray-800 text-white hover:bg-gray-700"
                }`}
                onClick={() => onTimeChange(slot)}
              >
                {slot}
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default DateTimeSelector;
