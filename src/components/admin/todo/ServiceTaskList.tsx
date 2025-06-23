
import { CalendarClock } from "lucide-react";
import { ServiceTaskItem } from "@/types/task";
import { Booking } from "@/types/booking";
import BookingInfoHeader from "./BookingInfoHeader";
import TaskTableHeader from "./TaskTableHeader";
import TaskRow from "./TaskRow";
import JobCompletionSection from "./JobCompletionSection";

interface ServiceTaskListProps {
  currentBooking: Booking | null;
  serviceTasks: ServiceTaskItem[];
  onToggleTask: (taskId: string) => void;
  onUpdateTimeAllocation: (taskId: string, newTime: number) => void;
  onSetActualTime: (taskId: string, time: number) => void;
  onFinishJob?: () => void;
}

const ServiceTaskList = ({
  currentBooking,
  serviceTasks,
  onToggleTask,
  onUpdateTimeAllocation,
  onSetActualTime,
  onFinishJob
}: ServiceTaskListProps) => {
  if (!currentBooking) {
    return (
      <div className="py-12 text-center">
        <CalendarClock className="mx-auto h-12 w-12 text-gray-500 mb-4" />
        <p className="text-gray-400">Select an appointment to view service tasks</p>
      </div>
    );
  }

  if (serviceTasks.length === 0) {
    return (
      <div className="py-12 text-center">
        <CalendarClock className="mx-auto h-12 w-12 text-gray-500 mb-4" />
        <p className="text-gray-400">No service tasks found for this booking.</p>
        <p className="text-gray-500 text-sm mt-1">This may happen if package details are missing.</p>
      </div>
    );
  }

  const completedTasks = serviceTasks.filter(task => task.completed).length;
  const progressPercentage = Math.round((completedTasks / serviceTasks.length) * 100);
  const allTasksCompleted = serviceTasks.length > 0 && serviceTasks.every(task => task.completed);

  return (
    <div>
      <BookingInfoHeader
        currentBooking={currentBooking}
        completedTasks={completedTasks}
        totalTasks={serviceTasks.length}
        progressPercentage={progressPercentage}
      />

      <TaskTableHeader />
      
      <ul className="space-y-2 mb-6">
        {serviceTasks.map((task) => (
          <TaskRow
            key={task.id}
            task={task}
            isJobFinished={currentBooking.status === "finished"}
            onToggleTask={onToggleTask}
            onUpdateTimeAllocation={onUpdateTimeAllocation}
            onSetActualTime={onSetActualTime}
          />
        ))}
      </ul>

      {/* Finish Job Button - moved to bottom for easier access */}
      {currentBooking.status === "in-progress" && (
        <JobCompletionSection
          allTasksCompleted={allTasksCompleted}
          onFinishJob={onFinishJob}
        />
      )}
    </div>
  );
};

export default ServiceTaskList;
