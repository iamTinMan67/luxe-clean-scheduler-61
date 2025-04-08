
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { packageOptions, serviceTasks } from "@/data/servicePackageData";
import { PackageType, ServiceTask, PackageOption } from "@/lib/types";
import PackageSelector from "@/components/package-management/PackageSelector";
import PackageTaskList from "@/components/package-management/PackageTaskList";
import TaskFormDialog from "@/components/package-management/TaskFormDialog";
import DeleteConfirmationDialog from "@/components/package-management/DeleteConfirmationDialog";

const ManagePackages = () => {
  const [packages, setPackages] = useState<PackageOption[]>(packageOptions);
  const [selectedPackageType, setSelectedPackageType] = useState<PackageType | null>(null);
  const [selectedPackage, setSelectedPackage] = useState<PackageOption | null>(null);
  
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<ServiceTask | undefined>(undefined);
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);
  
  useEffect(() => {
    if (selectedPackageType) {
      const pkg = packages.find(p => p.type === selectedPackageType) || null;
      setSelectedPackage(pkg);
    } else {
      setSelectedPackage(null);
    }
  }, [selectedPackageType, packages]);
  
  const handleSelectPackage = (packageType: PackageType) => {
    setSelectedPackageType(packageType);
  };
  
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
    if (!taskToDelete || !selectedPackage) return;
    
    const updatedPackages = packages.map(pkg => {
      if (pkg.type === selectedPackage.type) {
        return {
          ...pkg,
          tasks: pkg.tasks.filter(task => task.id !== taskToDelete)
        };
      }
      return pkg;
    });
    
    setPackages(updatedPackages);
    setIsDeleteDialogOpen(false);
    setTaskToDelete(null);
    toast.success("Task deleted successfully");
  };
  
  const handleMoveTask = (taskId: string, direction: "up" | "down") => {
    if (!selectedPackage) return;
    
    const packageIndex = packages.findIndex(pkg => pkg.type === selectedPackage.type);
    if (packageIndex === -1) return;
    
    const taskIndex = packages[packageIndex].tasks.findIndex(task => task.id === taskId);
    if (taskIndex === -1) return;
    
    const newIndex = direction === "up" ? taskIndex - 1 : taskIndex + 1;
    if (newIndex < 0 || newIndex >= packages[packageIndex].tasks.length) return;
    
    const updatedTasks = [...packages[packageIndex].tasks];
    const task = updatedTasks[taskIndex];
    updatedTasks.splice(taskIndex, 1);
    updatedTasks.splice(newIndex, 0, task);
    
    const updatedPackages = [...packages];
    updatedPackages[packageIndex] = {
      ...updatedPackages[packageIndex],
      tasks: updatedTasks
    };
    
    setPackages(updatedPackages);
    toast.success(`Task moved ${direction}`);
  };
  
  const handleSaveTask = (task: ServiceTask) => {
    if (!selectedPackage) return;
    
    const isEditing = !!editingTask;
    
    const updatedPackages = packages.map(pkg => {
      if (pkg.type === selectedPackage.type) {
        if (isEditing) {
          return {
            ...pkg,
            tasks: pkg.tasks.map(t => t.id === task.id ? task : t)
          };
        } else {
          return {
            ...pkg,
            tasks: [...pkg.tasks, task]
          };
        }
      }
      return pkg;
    });
    
    setPackages(updatedPackages);
    setIsTaskFormOpen(false);
    setEditingTask(undefined);
    
    toast.success(isEditing ? "Task updated successfully" : "Task added successfully");
  };
  
  const handleUpdateTaskDuration = (taskId: string, duration: number) => {
    if (!selectedPackage) return;
    
    const updatedPackages = packages.map(pkg => {
      if (pkg.type === selectedPackage.type) {
        return {
          ...pkg,
          tasks: pkg.tasks.map(task => 
            task.id === taskId ? { ...task, duration } : task
          )
        };
      }
      return pkg;
    });
    
    setPackages(updatedPackages);
    toast.success("Task duration updated");
  };

  return (
    <div className="container py-20 px-4 mx-auto max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Manage Packages</h1>
        <p className="text-gold/70 mt-2">
          Update service packages, manage tasks, and set durations
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6">
        {/* Package Selector */}
        <div className="md:col-span-1">
          <PackageSelector 
            packages={packages}
            selectedPackage={selectedPackageType}
            onSelectPackage={handleSelectPackage}
          />
        </div>
        
        {/* Package Details */}
        <div className="md:col-span-3 space-y-6">
          {selectedPackage ? (
            <>
              <Card className="bg-black/60 border-gold/30">
                <CardHeader>
                  <CardTitle className="text-white">{selectedPackage.name}</CardTitle>
                  <CardDescription className="text-gold/70">
                    Base Price: £{selectedPackage.basePrice} - {selectedPackage.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <PackageTaskList 
                    packageOption={selectedPackage}
                    onAddTask={handleAddTask}
                    onEditTask={handleEditTask}
                    onDeleteTask={handleDeleteTask}
                    onMoveTask={handleMoveTask}
                    onUpdateTaskDuration={handleUpdateTaskDuration}
                  />
                </CardContent>
              </Card>
            </>
          ) : (
            <Card className="bg-black/60 border-gold/30">
              <CardContent className="p-12 text-center">
                <p className="text-white text-lg">
                  Select a package from the left to manage its tasks
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      
      {/* Task Form Dialog */}
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
    </div>
  );
};

export default ManagePackages;
