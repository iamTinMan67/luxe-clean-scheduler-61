
import { useState } from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Edit, Clock, Trash2, Move, Package } from "lucide-react";
import { ServiceTask, PackageOption } from "@/lib/types";

interface TaskRowProps {
  task: ServiceTask;
  index: number;
  totalTasks: number;
  allPackages: PackageOption[];
  currentPackageType: string;
  onEditTask: (task: ServiceTask) => void;
  onDeleteTask: (taskId: string) => void;
  onMoveTask: (taskId: string, direction: "up" | "down") => void;
  onUpdateTaskDuration: (taskId: string, duration: number) => void;
  onMoveToPackage: (taskId: string, targetPackageId: string) => void;
}

const TaskRow = ({
  task,
  index,
  totalTasks,
  allPackages,
  currentPackageType,
  onEditTask,
  onDeleteTask,
  onMoveTask,
  onUpdateTaskDuration,
  onMoveToPackage
}: TaskRowProps) => {
  const [editingDuration, setEditingDuration] = useState<boolean>(false);
  const [durationValue, setDurationValue] = useState<number>(task.duration);
  const [showMoveOptions, setShowMoveOptions] = useState<boolean>(false);

  const handleEditDuration = () => {
    setEditingDuration(true);
    setDurationValue(task.duration);
  };

  const handleSaveDuration = () => {
    onUpdateTaskDuration(task.id, durationValue);
    setEditingDuration(false);
  };

  const toggleMoveOptions = () => {
    setShowMoveOptions(!showMoveOptions);
  };

  return (
    <TableRow key={task.id} className="border-gold/20 hover:bg-gold/5">
      <TableCell className="text-center">
        <div className="flex flex-col space-y-1">
          <Button 
            size="icon" 
            variant="ghost" 
            className="h-6 w-6 text-white hover:text-gold hover:bg-gold/10" 
            onClick={() => onMoveTask(task.id, "up")}
            disabled={index === 0}
          >
            <Move size={14} className="rotate-90" />
          </Button>
          <Button 
            size="icon" 
            variant="ghost" 
            className="h-6 w-6 text-white hover:text-gold hover:bg-gold/10" 
            onClick={() => onMoveTask(task.id, "down")}
            disabled={index === totalTasks - 1}
          >
            <Move size={14} className="rotate-[270deg]" />
          </Button>
        </div>
      </TableCell>
      <TableCell className="text-white">{task.name}</TableCell>
      <TableCell className="text-right text-white">£{task.price}</TableCell>
      <TableCell className="text-right">
        {editingDuration ? (
          <div className="flex items-center justify-end space-x-2">
            <Input 
              type="number" 
              value={durationValue} 
              onChange={(e) => setDurationValue(parseInt(e.target.value) || 0)}
              className="w-20 text-right bg-black/30 border-gold/30 text-white"
            />
            <Button 
              size="sm" 
              variant="outline" 
              className="h-7 border-gold/30 text-white hover:bg-gold/20"
              onClick={handleSaveDuration}
            >
              Save
            </Button>
          </div>
        ) : (
          <div 
            className="flex items-center justify-end space-x-2 cursor-pointer group" 
            onClick={handleEditDuration}
          >
            <span className="text-white">{task.duration}</span>
            <Clock size={14} className="text-gold/50 group-hover:text-gold transition-colors" />
          </div>
        )}
      </TableCell>
      <TableCell className="text-center">
        <div className={`w-5 h-5 mx-auto rounded-full border ${
          task.included 
            ? "bg-gold border-gold" 
            : "border-gray-600"
        } flex items-center justify-center`}>
          {task.included && <div className="w-3 h-3 rounded-full bg-black"></div>}
        </div>
      </TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end space-x-1">
          <Button 
            size="icon" 
            variant="ghost" 
            className="h-8 w-8 text-white hover:text-gold hover:bg-gold/10"
            onClick={() => onEditTask(task)}
          >
            <Edit size={14} />
          </Button>
          <div className="relative">
            <Button 
              size="icon" 
              variant="ghost" 
              className="h-8 w-8 text-white hover:text-gold hover:bg-gold/10"
              onClick={toggleMoveOptions}
            >
              <Package size={14} />
            </Button>
            {showMoveOptions && (
              <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-black border border-gold/30 z-10">
                <div className="py-1">
                  <p className="px-4 py-2 text-xs text-gold/70 border-b border-gold/20">Move to package:</p>
                  {allPackages
                    .filter(pkg => pkg.type !== currentPackageType)
                    .map(pkg => (
                      <button
                        key={pkg.type}
                        className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-gold/10"
                        onClick={() => {
                          onMoveToPackage(task.id, pkg.type);
                          setShowMoveOptions(false);
                        }}
                      >
                        {pkg.name}
                      </button>
                    ))}
                </div>
              </div>
            )}
          </div>
          <Button 
            size="icon" 
            variant="ghost" 
            className="h-8 w-8 text-white hover:text-red-500 hover:bg-red-500/10"
            onClick={() => onDeleteTask(task.id)}
          >
            <Trash2 size={14} />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};

export default TaskRow;
