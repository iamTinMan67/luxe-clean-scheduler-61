
import { Label } from "@/components/ui/label";
import DateTimeSelector from "@/components/booking/DateTimeSelector";

interface DateTimeSectionProps {
  selectedDate: Date | undefined;
  selectedTime: string;
  onDateChange: (date: Date | undefined) => void;
  onTimeChange: (time: string) => void;
}

const DateTimeSection = ({ 
  selectedDate, 
  selectedTime, 
  onDateChange, 
  onTimeChange 
}: DateTimeSectionProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="md:col-span-2">
        <Label className="text-white mb-2 block">Select Date & Available Time</Label>
        <DateTimeSelector 
          date={selectedDate}
          time={selectedTime}
          onDateChange={onDateChange}
          onTimeChange={onTimeChange}
        />
      </div>
    </div>
  );
};

export default DateTimeSection;
