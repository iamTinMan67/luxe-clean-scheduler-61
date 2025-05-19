import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { ServiceTask, PackageOption } from "@/lib/types";
import { Plus } from "lucide-react";

interface TaskOperationsProps {
  selectedPackage: PackageOption | null;
  onSaveTask: (task: ServiceTask) => void;
  onDeleteTask: (taskId: string) => void;
}

const TaskOperations = ({ selectedPackage, onSaveTask, onDeleteTask }: TaskOperationsProps) => {
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingTask, setEditingTask] = useState<ServiceTask>({
    id: "",
    name: "",
    price: 0,
    duration: 60,
    included: false
  });
  
  useEffect(() => {
    if (open && selectedPackage) {
      // Check if we are editing an existing task
      const taskToEdit = selectedPackage.tasks.find(task => task.id === editingTask.id);
      if (taskToEdit) {
        setIsEditing(true);
        setEditingTask(taskToEdit);
      } else {
        setIsEditing(false);
        setEditingTask({
          id: "",
          name: "",
          price: 0,
          duration: 60,
          included: false
        });
      }
    }
  }, [open, selectedPackage, editingTask.id]);
  
  const handleTaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingTask.name || editingTask.price < 0) {
      toast.error("Please fill in all fields correctly.");
      return;
    }
    
    onSaveTask(editingTask);
    setOpen(false);
    setEditingTask({
      id: "",
      name: "",
      price: 0,
      duration: 60,
      included: false
    });
  };
  
  const handleTaskDelete = () => {
    onDeleteTask(editingTask.id);
    setOpen(false);
    setEditingTask({
      id: "",
      name: "",
      price: 0,
      duration: 60,
      included: false
    });
  };

  const handleTaskDurationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const duration = parseInt(e.target.value);
    if (isNaN(duration) || duration < 0) return;
    
    setEditingTask({
      ...editingTask,
      duration
    });
  };
  
  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button id="add-task-button" variant="outline" className="bg-black/30 border-gold/30 text-gold hover:bg-black/50">
            <Plus className="h-4 w-4 mr-2" />
            Add Task
          </Button>
        </DialogTrigger>
        <DialogContent className="bg-gray-950 border-gray-800 sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-white">{isEditing ? "Edit Task" : "Add Task"}</DialogTitle>
            <DialogDescription className="text-gray-400">
              {isEditing
                ? "Modify the details of this service task."
                : "Create a new service task for this package."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleTaskSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="task-name" className="text-right text-white">
                  Name
                </Label>
                <Input
                  id="task-name"
                  value={editingTask.name}
                  onChange={(e) => setEditingTask({ ...editingTask, name: e.target.value })}
                  className="col-span-3 bg-gray-900 border-gray-700 text-white"
                  placeholder="Task name"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="task-price" className="text-right text-white">
                  Price (£)
                </Label>
                <Input
                  id="task-price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={editingTask.price}
                  onChange={(e) => setEditingTask({ ...editingTask, price: parseFloat(e.target.value) || 0 })}
                  className="col-span-3 bg-gray-900 border-gray-700 text-white"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="task-duration" className="text-right text-white">
                  Duration (min)
                </Label>
                <Input
                  id="task-duration"
                  type="number"
                  min="1"
                  step="1"
                  value={editingTask.duration}
                  onChange={handleTaskDurationChange}
                  className="col-span-3 bg-gray-900 border-gray-700 text-white"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right text-white">
                  Included
                </Label>
                <div className="col-span-3">
                  <Checkbox
                    checked={editingTask.included}
                    onCheckedChange={(checked) => setEditingTask({ ...editingTask, included: !!checked })}
                    className="border-gold/50"
                  />
                  <span className="ml-2 text-gray-400 text-sm">Included in base package price</span>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="ghost" className="bg-gray-800 hover:bg-gray-700" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              {isEditing && (
                <Button variant="destructive" onClick={handleTaskDelete} className="mr-2">
                  Delete
                </Button>
              )}
              <Button type="submit" className="bg-gold hover:bg-gold/80 text-black">
                {isEditing ? "Save changes" : "Save"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TaskOperations;
