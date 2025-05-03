
import { useState } from "react";
import { ServiceTask, PackageOption } from "@/lib/types";
import TaskFormDialog from "@/components/package-management/TaskFormDialog";
import DeleteConfirmationDialog from "@/components/package-management/DeleteConfirmationDialog";

interface TaskOperationsProps {
  selectedPackage: PackageOption | null;
  onSaveTask: (task: ServiceTask) => void;
  onDeleteTask: (taskId: string) => void;
}

const TaskOperations = ({
  selectedPackage,
  onSaveTask,
  onDeleteTask
}: TaskOperationsProps) => {
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<ServiceTask | undefined>(undefined);
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);

  const handleAddTask = () => {
    setEditingTask(undefined);
    setIsTaskFormOpen(true);
  };
  
  const handleEditTask = (task: ServiceTask) => {
    setEditingTask(task);
    setIsTaskFormOpen(true);
  };
  
  const handleDeleteTask = (taskId: string) => {
    setTaskToDelete(taskId);
    setIsDeleteDialogOpen(true);
  };
  
  const confirmDeleteTask = () => {
    if (!taskToDelete) return;
    
    onDeleteTask(taskToDelete);
    setIsDeleteDialogOpen(false);
    setTaskToDelete(null);
  };
  
  const handleSaveTask = (task: ServiceTask) => {
    onSaveTask(task);
    setIsTaskFormOpen(false);
    setEditingTask(undefined);
  };

  return (
    <>
      {/* TaskForm Dialog */}
      <TaskFormDialog 
        isOpen={isTaskFormOpen}
        onClose={() => setIsTaskFormOpen(false)}
        onSave={handleSaveTask}
        task={editingTask}
        isEditing={!!editingTask}
      />
      
      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog 
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={confirmDeleteTask}
        title="Delete Task"
        description="Are you sure you want to delete this task? This action cannot be undone."
      />
      
      {/* Return helper functions for external components to use */}
      {({ 
        handleAddTask,
        handleEditTask,
        handleDeleteTask
      })}
    </>
  );
};

export default TaskOperations;
