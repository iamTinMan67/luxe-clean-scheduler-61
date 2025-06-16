
import { Textarea } from "@/components/ui/textarea";

interface ConditionNotesFormProps {
  showDeclineNotes: boolean;
  exteriorNotes: string;
  interiorNotes: string;
  setExteriorNotes: (value: string) => void;
  setInteriorNotes: (value: string) => void;
}

const ConditionNotesForm = ({
  showDeclineNotes,
  exteriorNotes,
  interiorNotes,
  setExteriorNotes,
  setInteriorNotes,
}: ConditionNotesFormProps) => {
  if (!showDeclineNotes) return null;

  return (
    <>
      <div>
        <label htmlFor="exteriorNotes" className="text-white text-sm font-medium block mb-1">
          Exterior Condition Issues (Reason for decline)
        </label>
        <Textarea 
          id="exteriorNotes" 
          className="bg-black/40 border-gold/30 text-white min-h-[100px]" 
          placeholder="Note any existing damage, scratches, dents, etc."
          value={exteriorNotes}
          onChange={(e) => setExteriorNotes(e.target.value)}
        />
      </div>
      
      <div>
        <label htmlFor="interiorNotes" className="text-white text-sm font-medium block mb-1">
          Interior Condition Issues (Reason for decline)
        </label>
        <Textarea 
          id="interiorNotes" 
          className="bg-black/40 border-gold/30 text-white min-h-[100px]" 
          placeholder="Note any dog hairs, stains, wear, etc."
          value={interiorNotes}
          onChange={(e) => setInteriorNotes(e.target.value)}
        />
      </div>
    </>
  );
};

export default ConditionNotesForm;
