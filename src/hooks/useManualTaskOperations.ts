
import { TaskItem } from './useManualTaskFormState';

export const useManualTaskOperations = (
  tasks: TaskItem[],
  setTasks: React.Dispatch<React.SetStateAction<TaskItem[]>>
) => {
  const addTask = () => {
    const newTask: TaskItem = {
      id: `task-${Date.now()}`,
      description: '',
      hours: 0,
      rate: 0,
      cost: 0
    };
    setTasks([...tasks, newTask]);
  };

  const updateTask = (id: string, field: keyof TaskItem, value: string | number) => {
    setTasks(tasks.map(task => {
      if (task.id === id) {
        const updatedTask = { ...task, [field]: value };
        // Recalculate cost when hours or rate changes
        if (field === 'hours' || field === 'rate') {
          updatedTask.cost = updatedTask.hours * updatedTask.rate;
        }
        return updatedTask;
      }
      return task;
    }));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const moveTaskUp = (index: number) => {
    if (index > 0) {
      const newTasks = [...tasks];
      [newTasks[index], newTasks[index - 1]] = [newTasks[index - 1], newTasks[index]];
      setTasks(newTasks);
    }
  };

  const moveTaskDown = (index: number) => {
    if (index < tasks.length - 1) {
      const newTasks = [...tasks];
      [newTasks[index], newTasks[index + 1]] = [newTasks[index + 1], newTasks[index]];
      setTasks(newTasks);
    }
  };

  return {
    addTask,
    updateTask,
    deleteTask,
    moveTaskUp,
    moveTaskDown
  };
};
