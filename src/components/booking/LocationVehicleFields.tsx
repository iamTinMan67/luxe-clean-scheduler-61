
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface LocationVehicleFieldsProps {
  postcode: string;
  setPostcode: (value: string) => void;
  jobDetails: string;
  setJobDetails: (value: string) => void;
  notes: string;
  setNotes: (value: string) => void;
}

const LocationVehicleFields = ({
  postcode,
  setPostcode,
  jobDetails,
  setJobDetails,
  notes,
  setNotes
}: LocationVehicleFieldsProps) => {
  return (
    <>
      <div>
        <Label htmlFor="postcode" className="text-white">Post Code</Label>
        <Input 
          id="postcode" 
          placeholder="What's the Post Code"
          value={postcode}
          onChange={(e) => setPostcode(e.target.value)}
          className="bg-gray-800 border-gray-700 text-white"
          required
        />
      </div>
      
      <div>
        <Label htmlFor="jobDetails" className="text-white">
          Job Details
        </Label>
        <Input 
          id="jobDetails" 
          placeholder="Vehicle type, registration or other relevant details"
          value={jobDetails}
          onChange={(e) => setJobDetails(e.target.value)}
          className="bg-gray-800 border-gray-700 text-white"
        />
      </div>
    </>
  );
};

export default LocationVehicleFields;
