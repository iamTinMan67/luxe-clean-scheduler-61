
import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

interface ConditionSliderProps {
  value: number;
  onChange: (value: number) => void;
}

const ConditionSlider = ({ value, onChange }: ConditionSliderProps) => {
  const handleValueChange = (values: number[]) => {
    onChange(values[0]);
  };

  const getConditionText = () => {
    if (value <= 2) return "Poor condition";
    if (value <= 4) return "Below average condition";
    if (value <= 6) return "Average condition";
    if (value <= 8) return "Good condition";
    return "Excellent condition";
  };

  const getConditionColor = () => {
    if (value <= 2) return "text-red-500";
    if (value <= 4) return "text-orange-500";
    if (value <= 6) return "text-yellow-500";
    if (value <= 8) return "text-green-400";
    return "text-green-500";
  };

  return (
    <div className="py-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold text-white">Vehicle Condition</h3>
        <div className="flex items-center space-x-2">
          <span className={cn("text-sm font-medium", getConditionColor())}>
            {getConditionText()}
          </span>
          <span className="text-lg font-bold text-gold">{value}/10</span>
        </div>
      </div>
      
      <div className="pt-4 pb-2">
        <Slider
          defaultValue={[value]}
          max={10}
          min={1}
          step={1}
          onValueChange={handleValueChange}
          className="[&_[role=slider]]:bg-gold"
        />
      </div>
      
      <div className="flex justify-between mt-1 text-xs text-gray-400">
        <span>Very Dirty</span>
        <span>Average</span>
        <span>Very Clean</span>
      </div>
    </div>
  );
};

export default ConditionSlider;
