
import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface DatePickerProps {
  date?: Date
  onDateChange: (date: Date | undefined) => void
  onFocus?: () => void
}

export function DatePicker({ date, onDateChange, onFocus }: DatePickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal",
            !date && "text-muted-foreground",
            "bg-gray-800 border-gray-700 text-white hover:bg-gray-700 hover:text-white"
          )}
          onFocus={onFocus}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 bg-gray-800 border-gray-700" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={onDateChange}
          initialFocus
          className={cn("p-3 pointer-events-auto")}
          classNames={{
            day_selected: "bg-gold text-black",
            day_today: "bg-gray-700 text-white",
            day: "text-white hover:bg-gray-700"
          }}
          disabled={(date) => {
            // Disable past dates
            const now = new Date();
            now.setHours(0, 0, 0, 0);
            return date < now;
          }}
        />
      </PopoverContent>
    </Popover>
  );
}
