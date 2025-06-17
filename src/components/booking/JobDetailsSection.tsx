
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface JobDetailsSectionProps {
  jobDetails: string;
  setJobDetails: (value: string) => void;
  notes: string;
  setNotes: (value: string) => void;
}

const JobDetailsSection = ({
  jobDetails,
  setJobDetails,
  notes,
  setNotes
}: JobDetailsSectionProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-white mb-4">Job Details</h3>
      
      <div>
        <Label htmlFor="jobDetails" className="text-white">
          Job Details
        </Label>
        <Input 
          id="jobDetails" 
          placeholder="Boat, Caravan, etc."
          value={jobDetails}
          onChange={(e) => setJobDetails(e.target.value)}
          className="bg-gray-800 border-gray-700 text-white"
        />
      </div>

      <div>
        <Label htmlFor="notes" className="text-white">Any Notes</Label>
        <Textarea 
          id="notes" 
          placeholder="Brief job requirements and any notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="bg-gray-800 border-gray-700 text-white h-24"
        />
      </div>
    </div>
  );
};

export default JobDetailsSection;
