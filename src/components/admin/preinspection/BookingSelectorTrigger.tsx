
import { SelectTrigger, SelectValue } from "@/components/ui/select";

interface BookingSelectorTriggerProps {
  placeholderText: string;
}

const BookingSelectorTrigger = ({ placeholderText }: BookingSelectorTriggerProps) => {
  return (
    <SelectTrigger className="bg-black/40 border-gold/30 text-white">
      <SelectValue placeholder={placeholderText} />
    </SelectTrigger>
  );
};

export default BookingSelectorTrigger;
