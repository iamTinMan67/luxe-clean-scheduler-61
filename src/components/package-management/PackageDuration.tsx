
import { ServiceTask } from "@/lib/types";
import { Clock } from "lucide-react";

interface PackageDurationProps {
  tasks: ServiceTask[];
}

const PackageDuration = ({ tasks }: PackageDurationProps) => {
  // Calculate total duration in minutes
  const totalMinutes = tasks.reduce((total, task) => total + task.duration, 0);
  
  // Convert to hours and minutes
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  
  // Format the time display
  const formattedTime = hours > 0 
    ? `${hours} hour${hours !== 1 ? 's' : ''} ${minutes > 0 ? `${minutes} min${minutes !== 1 ? 's' : ''}` : ''}` 
    : `${minutes} min${minutes !== 1 ? 's' : ''}`;

  return (
    <div className="flex items-center text-gold/90 bg-black/40 p-2 rounded-md text-sm">
      <Clock className="h-4 w-4 mr-1" />
      <span>Total Duration: {formattedTime}</span>
    </div>
  );
};

export default PackageDuration;
