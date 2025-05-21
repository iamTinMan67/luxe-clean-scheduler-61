
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface LocationVehicleFieldsProps {
  postcode: string;
  setPostcode: (value: string) => void;
  vehicleReg: string;
  setVehicleReg: (value: string) => void;
  notes: string;
  setNotes: (value: string) => void;
}

const LocationVehicleFields = ({
  postcode,
  setPostcode,
  vehicleReg,
  setVehicleReg,
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
        <Label htmlFor="vehicleReg" className="text-white">
          Vehicle Reg/Details
        </Label>
        <Input 
          id="vehicleReg" 
          placeholder="Car registration or details for other vehicle types"
          value={vehicleReg}
          onChange={(e) => setVehicleReg(e.target.value)}
          className="bg-gray-800 border-gray-700 text-white"
        />
      </div>
    </>
  );
};

export default LocationVehicleFields;
