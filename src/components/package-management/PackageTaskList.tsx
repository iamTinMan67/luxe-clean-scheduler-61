
import { Table, TableBody } from "@/components/ui/table";
import { ServiceTask, PackageOption } from "@/lib/types";
import TaskListHeader from "./TaskListHeader";
import TaskTableHeader from "./TaskTableHeader";
import TaskRow from "./TaskRow";
import PackageDuration from "./PackageDuration";

interface PackageTaskListProps {
  packageOption: PackageOption;
  allPackages: PackageOption[];
  onAddTask: () => void;
  onEditTask: (task: ServiceTask) => void;
  onDeleteTask: (taskId: string) => void;
  onMoveTask: (taskId: string, direction: "up" | "down") => void;
  onUpdateTaskDuration: (taskId: string, duration: number) => void;
  onMoveToPackage: (taskId: string, targetPackageId: string) => void;
}

const PackageTaskList = ({
  packageOption,
  allPackages,
  onAddTask,
  onEditTask,
  onDeleteTask,
  onMoveTask,
  onUpdateTaskDuration,
  onMoveToPackage
}: PackageTaskListProps) => {
  return (
    <div className="rounded-md border border-gold/30 bg-black/50">
      <div className="flex justify-between items-center">
        <TaskListHeader onAddTask={onAddTask} />
        <div className="pr-4">
          <PackageDuration tasks={packageOption.tasks} />
        </div>
      </div>
      
      <Table>
        <TaskTableHeader />
        <TableBody>
          {packageOption.tasks.map((task, index) => (
            <TaskRow
              key={task.id}
              task={task}
              index={index}
              totalTasks={packageOption.tasks.length}
              allPackages={allPackages}
              currentPackageType={packageOption.type}
              onEditTask={onEditTask}
              onDeleteTask={onDeleteTask}
              onMoveTask={onMoveTask}
              onUpdateTaskDuration={onUpdateTaskDuration}
              onMoveToPackage={onMoveToPackage}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default PackageTaskList;
