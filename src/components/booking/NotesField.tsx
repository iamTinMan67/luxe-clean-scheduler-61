
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface NotesFieldProps {
  notes: string;
  setNotes: (value: string) => void;
}

const NotesField = ({ notes, setNotes }: NotesFieldProps) => {
  return (
    <div>
      <Label htmlFor="notes" className="text-white">Any Notes</Label>
      <Textarea 
        id="notes" 
        placeholder="Any special instructions or requirements?"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        className="bg-gray-800 border-gray-700 text-white h-24"
      />
    </div>
  );
};

export default NotesField;
