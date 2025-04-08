
import { useState } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Edit, Clock, Trash2, Move } from "lucide-react";
import { ServiceTask, PackageOption } from "@/lib/types";

interface PackageTaskListProps {
  packageOption: PackageOption;
  onAddTask: () => void;
  onEditTask: (task: ServiceTask) => void;
  onDeleteTask: (taskId: string) => void;
  onMoveTask: (taskId: string, direction: "up" | "down") => void;
  onUpdateTaskDuration: (taskId: string, duration: number) => void;
}

const PackageTaskList = ({
  packageOption,
  onAddTask,
  onEditTask,
  onDeleteTask,
  onMoveTask,
  onUpdateTaskDuration
}: PackageTaskListProps) => {
  const [editingDuration, setEditingDuration] = useState<{[key: string]: boolean}>({});
  const [durationValues, setDurationValues] = useState<{[key: string]: number}>({});

  const handleEditDuration = (taskId: string, currentDuration: number) => {
    setEditingDuration({...editingDuration, [taskId]: true});
    setDurationValues({...durationValues, [taskId]: currentDuration});
  };

  const handleSaveDuration = (taskId: string) => {
    onUpdateTaskDuration(taskId, durationValues[taskId]);
    setEditingDuration({...editingDuration, [taskId]: false});
  };

  return (
    <div className="rounded-md border border-gold/30 bg-black/50">
      <div className="flex items-center justify-between p-4">
        <h3 className="text-lg font-medium text-white">Tasks</h3>
        <Button onClick={onAddTask} size="sm" className="gold-gradient text-black hover:shadow-gold/20">
          <Plus size={16} className="mr-1" /> Add Task
        </Button>
      </div>
      
      <Table>
        <TableHeader className="bg-black/50">
          <TableRow className="border-gold/20">
            <TableHead className="w-12 text-gold/80"></TableHead>
            <TableHead className="text-gold/80">Task Name</TableHead>
            <TableHead className="text-gold/80 text-right">Price (£)</TableHead>
            <TableHead className="text-gold/80 text-right">Duration (min)</TableHead>
            <TableHead className="text-gold/80 text-center">Included</TableHead>
            <TableHead className="text-gold/80 text-right w-32">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {packageOption.tasks.map((task, index) => (
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
                    disabled={index === packageOption.tasks.length - 1}
                  >
                    <Move size={14} className="rotate-[270deg]" />
                  </Button>
                </div>
              </TableCell>
              <TableCell className="text-white">{task.name}</TableCell>
              <TableCell className="text-right text-white">£{task.price}</TableCell>
              <TableCell className="text-right">
                {editingDuration[task.id] ? (
                  <div className="flex items-center justify-end space-x-2">
                    <Input 
                      type="number" 
                      value={durationValues[task.id]} 
                      onChange={(e) => setDurationValues({
                        ...durationValues, 
                        [task.id]: parseInt(e.target.value) || 0
                      })}
                      className="w-20 text-right bg-black/30 border-gold/30 text-white"
                    />
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="h-7 border-gold/30 text-white hover:bg-gold/20"
                      onClick={() => handleSaveDuration(task.id)}
                    >
                      Save
                    </Button>
                  </div>
                ) : (
                  <div 
                    className="flex items-center justify-end space-x-2 cursor-pointer group" 
                    onClick={() => handleEditDuration(task.id, task.duration)}
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
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default PackageTaskList;
