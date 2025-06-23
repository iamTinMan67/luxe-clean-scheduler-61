
import { Clock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ServiceTaskItem } from "@/types/task";

interface TaskRowProps {
  task: ServiceTaskItem;
  isJobFinished: boolean;
  onToggleTask: (taskId: string) => void;
  onUpdateTimeAllocation: (taskId: string, newTime: number) => void;
  onSetActualTime: (taskId: string, time: number) => void;
}

const TaskRow = ({
  task,
  isJobFinished,
  onToggleTask,
  onUpdateTimeAllocation,
  onSetActualTime
}: TaskRowProps) => {
  const handleCheckboxChange = (taskId: string, checked: boolean) => {
    console.log("Checkbox changed for task:", taskId, "checked:", checked);
    onToggleTask(taskId);
  };

  const handleActualTimeChange = (taskId: string, value: string) => {
    const actualTime = parseInt(value) || 0;
    console.log("Setting actual time for task:", taskId, "time:", actualTime);
    onSetActualTime(taskId, actualTime);
  };

  return (
    <li className="flex items-center border border-gray-800 p-3 rounded-md bg-gray-900/30">
      <div className="grid grid-cols-12 gap-2 w-full items-center">
        <div className="col-span-5 flex items-center">
          <div className="mr-3">
            <Checkbox
              id={`task-${task.id}`}
              checked={task.completed}
              onCheckedChange={(checked) => handleCheckboxChange(task.id, checked === true)}
              disabled={isJobFinished}
              className="h-4 w-4"
            />
          </div>
          <label
            htmlFor={`task-${task.id}`}
            className={`cursor-pointer ${task.completed ? 'line-through text-gray-500' : 'text-white'} ${isJobFinished ? 'cursor-not-allowed' : ''}`}
          >
            {task.name}
          </label>
        </div>
        
        <div className="col-span-2 text-center">
          <span className={`px-2 py-1 rounded text-xs ${
            task.completed 
              ? 'bg-green-900/40 text-green-400' 
              : 'bg-amber-900/40 text-amber-400'
          }`}>
            {task.completed ? 'Completed' : 'Pending'}
          </span>
        </div>
        
        <div className="col-span-2">
          <div className="flex items-center justify-center">
            <Input
              type="number"
              min="1"
              value={task.allocatedTime}
              onChange={(e) => {
                const newTime = parseInt(e.target.value) || task.allocatedTime;
                onUpdateTimeAllocation(task.id, newTime);
              }}
              disabled={isJobFinished}
              className="w-16 text-center bg-black/70 border-gray-700 text-white disabled:opacity-50"
            />
            <span className="ml-1 text-gray-400">min</span>
          </div>
        </div>
        
        <div className="col-span-3">
          <div className="flex items-center justify-center">
            <Input
              type="number"
              min="0"
              value={task.actualTime || ''}
              placeholder="0"
              onChange={(e) => handleActualTimeChange(task.id, e.target.value)}
              disabled={isJobFinished}
              className="w-16 text-center bg-black/70 border-gray-700 text-white disabled:opacity-50"
            />
            <span className="ml-1 text-gray-400">min</span>
            <Button 
              variant="ghost" 
              size="sm" 
              className="ml-1 text-gold hover:text-gold/80 p-1 disabled:opacity-50"
              onClick={() => onSetActualTime(task.id, task.allocatedTime)}
              title="Set to allocated time"
              disabled={isJobFinished}
            >
              <Clock className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </li>
  );
};

export default TaskRow;
