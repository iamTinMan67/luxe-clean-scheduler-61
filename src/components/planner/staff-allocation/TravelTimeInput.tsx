
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface TravelTimeInputProps {
  travelTime: number;
  onTravelTimeChange: (time: number) => void;
}

const TravelTimeInput: React.FC<TravelTimeInputProps> = ({ 
  travelTime, 
  onTravelTimeChange 
}) => {
  return (
    <div>
      <Label htmlFor="travel-time" className="text-white">Travel time (minutes):</Label>
      <Input 
        id="travel-time"
        type="number"
        min="0"
        value={travelTime}
        onChange={(e) => onTravelTimeChange(parseInt(e.target.value) || 0)}
        className="bg-black/40 border-gold/30 text-white"
      />
    </div>
  );
};

export default TravelTimeInput;
