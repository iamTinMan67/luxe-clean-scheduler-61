
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface TaskListHeaderProps {
  onAddTask: () => void;
}

const TaskListHeader = ({ onAddTask }: TaskListHeaderProps) => (
  <div className="flex items-center justify-between p-4">
    <h3 className="text-lg font-medium text-white">Tasks</h3>
    <Button onClick={onAddTask} size="sm" className="gold-gradient text-black hover:shadow-gold/20">
      <Plus size={16} className="mr-1" /> Add Task
    </Button>
  </div>
);

export default TaskListHeader;
