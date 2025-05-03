
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { PackageType, ServiceTask, PackageOption } from "@/lib/types";

export function usePackageManager(initialPackages: PackageOption[]) {
  const [packages, setPackages] = useState<PackageOption[]>(initialPackages);
  const [selectedPackageType, setSelectedPackageType] = useState<PackageType | null>(null);
  const [selectedPackage, setSelectedPackage] = useState<PackageOption | null>(null);
  
  // Update selected package when package type changes
  useEffect(() => {
    if (selectedPackageType) {
      const pkg = packages.find(p => p.type === selectedPackageType) || null;
      setSelectedPackage(pkg);
    } else {
      setSelectedPackage(null);
    }
  }, [selectedPackageType, packages]);
  
  // Package selection function
  const handleSelectPackage = (packageType: PackageType) => {
    setSelectedPackageType(packageType);
  };
  
  // Task operations
  const handleSaveTask = (task: ServiceTask) => {
    if (!selectedPackage) return;
    
    const isEditing = packages.some(pkg => 
      pkg.type === selectedPackage.type && 
      pkg.tasks.some(t => t.id === task.id)
    );
    
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
    toast.success(isEditing ? "Task updated successfully" : "Task added successfully");
  };
  
  const handleDeleteTask = (taskId: string) => {
    if (!selectedPackage) return;
    
    const updatedPackages = packages.map(pkg => {
      if (pkg.type === selectedPackage.type) {
        return {
          ...pkg,
          tasks: pkg.tasks.filter(task => task.id !== taskId)
        };
      }
      return pkg;
    });
    
    setPackages(updatedPackages);
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

  const handleMoveToPackage = (taskId: string, targetPackageType: string) => {
    if (!selectedPackage) return;
    
    // Find the task in the current package
    const taskToMove = selectedPackage.tasks.find(task => task.id === taskId);
    if (!taskToMove) return;
    
    // Remove task from current package and add to target package
    const updatedPackages = packages.map(pkg => {
      if (pkg.type === selectedPackage.type) {
        // Remove from current package
        return {
          ...pkg,
          tasks: pkg.tasks.filter(task => task.id !== taskId)
        };
      } else if (pkg.type === targetPackageType) {
        // Add to target package
        return {
          ...pkg,
          tasks: [...pkg.tasks, taskToMove]
        };
      }
      return pkg;
    });
    
    setPackages(updatedPackages);
    toast.success(`Task moved to ${packages.find(p => p.type === targetPackageType)?.name}`);
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

  return {
    packages,
    selectedPackageType,
    selectedPackage,
    handleSelectPackage,
    handleSaveTask,
    handleDeleteTask,
    handleMoveTask,
    handleMoveToPackage,
    handleUpdateTaskDuration
  };
}
