
import { ServiceTaskItem } from "@/types/task";
import { Booking } from "@/types/booking";

// Enhanced progress calculation with weighted tasks
export const calculateProgress = (serviceTasks: ServiceTaskItem[]): number => {
  if (serviceTasks.length === 0) return 0;
  
  const totalWeight = serviceTasks.reduce((sum, task) => sum + task.allocatedTime, 0);
  const completedWeight = serviceTasks
    .filter(task => task.completed)
    .reduce((sum, task) => sum + task.allocatedTime, 0);
  
  return totalWeight > 0 ? Math.round((completedWeight / totalWeight) * 100) : 0;
};

// Generate placeholder tasks for inspecting status
export const generatePlaceholderTasks = (booking: Booking): ServiceTaskItem[] => {
  return [
    {
      id: 'placeholder-inspection',
      name: 'Vehicle Inspection',
      completed: false,
      allocatedTime: 15
    },
    {
      id: 'placeholder-preparation',
      name: 'Service Preparation',
      completed: false,
      allocatedTime: 10
    },
    {
      id: 'placeholder-setup',
      name: 'Equipment Setup',
      completed: false,
      allocatedTime: 5
    }
  ];
};
