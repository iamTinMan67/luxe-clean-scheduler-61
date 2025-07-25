
import { Clock, CalendarClock, CheckCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ServiceTaskItem } from "@/types/task";
import { Booking } from "@/types/booking";
import { Checkbox } from "@/components/ui/checkbox";

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

  const handleCheckboxChange = (taskId: string, checked: boolean) => {
    console.log("Checkbox changed for task:", taskId, "checked:", checked);
    // Prevent the default event and handle the toggle directly
    onToggleTask(taskId);
  };

  const handleActualTimeChange = (taskId: string, value: string) => {
    const actualTime = parseInt(value) || 0;
    console.log("Setting actual time for task:", taskId, "time:", actualTime);
    onSetActualTime(taskId, actualTime);
  };

  return (
    <div>
      <div className="mb-4 p-4 border border-gold/20 rounded-md bg-black/40">
        <div className="flex justify-between mb-2">
          <span className="text-white font-semibold">{currentBooking.customer}</span>
          <span className="text-gold">{currentBooking.packageType} Package</span>
        </div>
        <div className="text-sm text-gray-400">
          <p>Vehicle: {currentBooking.vehicle} {currentBooking.vehicleReg ? `(${currentBooking.vehicleReg})` : ''}</p>
          <p>Location: {currentBooking.location}</p>
          <p>Date: {new Date(currentBooking.date).toLocaleDateString()} {currentBooking.time}</p>
          <p>Status: <span className="capitalize text-gold">{currentBooking.status}</span></p>
        </div>
        
        {/* Progress bar */}
        <div className="mt-3">
          <div className="flex justify-between text-sm text-gray-400 mb-1">
            <span>Progress</span>
            <span>{completedTasks}/{serviceTasks.length} tasks completed ({progressPercentage}%)</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div 
              className="bg-gold h-2 rounded-full transition-all duration-300" 
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>

        {/* Finish Job Button - only show for in-progress bookings when all tasks are completed */}
        {currentBooking.status === "in-progress" && allTasksCompleted && onFinishJob && (
          <div className="mt-4 text-center">
            <Button 
              onClick={onFinishJob}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md font-medium"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Finish Job & Generate Invoice
            </Button>
          </div>
        )}

        {/* Show completed status for finished jobs */}
        {currentBooking.status === "finished" && (
          <div className="mt-4 text-center">
            <div className="bg-green-900/40 text-green-400 px-4 py-2 rounded-md">
              <CheckCircle className="h-4 w-4 mr-2 inline" />
              Job Completed & Invoice Generated
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-12 gap-2 mb-2 text-sm font-medium text-gray-400 px-1">
        <div className="col-span-5">Task</div>
        <div className="col-span-2 text-center">Status</div>
        <div className="col-span-2 text-center">Allocated</div>
        <div className="col-span-3 text-center">Actual Time</div>
      </div>
      
      <ul className="space-y-2">
        {serviceTasks.map((task) => (
          <li key={task.id} className="flex items-center border border-gray-800 p-3 rounded-md bg-gray-900/30">
            <div className="grid grid-cols-12 gap-2 w-full items-center">
              <div className="col-span-5 flex items-center">
                <div className="mr-3">
                  <Checkbox
                    id={`task-${task.id}`}
                    checked={task.completed}
                    onCheckedChange={(checked) => handleCheckboxChange(task.id, checked === true)}
                    disabled={currentBooking.status === "finished"}
                    className="h-4 w-4"
                  />
                </div>
                <label
                  htmlFor={`task-${task.id}`}
                  className={`cursor-pointer ${task.completed ? 'line-through text-gray-500' : 'text-white'} ${currentBooking.status === "finished" ? 'cursor-not-allowed' : ''}`}
                >
                  {task.name}
                </label>
              </div>
              
              <div className="col-span-2 text-center">
                <span className={`px-2 py-1 rounded text-xs ${
                  task.completed 
                    ? 'bg-green-900/40 text-green-400' 
                    : 'bg-amber-900/40 text-amber-400'
                }`}>
                  {task.completed ? 'Completed' : 'Pending'}
                </span>
              </div>
              
              <div className="col-span-2">
                <div className="flex items-center justify-center">
                  <Input
                    type="number"
                    min="1"
                    value={task.allocatedTime}
                    onChange={(e) => {
                      const newTime = parseInt(e.target.value) || task.allocatedTime;
                      onUpdateTimeAllocation(task.id, newTime);
                    }}
                    disabled={currentBooking.status === "finished"}
                    className="w-16 text-center bg-black/70 border-gray-700 text-white disabled:opacity-50"
                  />
                  <span className="ml-1 text-gray-400">min</span>
                </div>
              </div>
              
              <div className="col-span-3">
                <div className="flex items-center justify-center">
                  <Input
                    type="number"
                    min="0"
                    value={task.actualTime || ''}
                    placeholder="0"
                    onChange={(e) => handleActualTimeChange(task.id, e.target.value)}
                    disabled={currentBooking.status === "finished"}
                    className="w-16 text-center bg-black/70 border-gray-700 text-white disabled:opacity-50"
                  />
                  <span className="ml-1 text-gray-400">min</span>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="ml-1 text-gold hover:text-gold/80 p-1 disabled:opacity-50"
                    onClick={() => onSetActualTime(task.id, task.allocatedTime)}
                    title="Set to allocated time"
                    disabled={currentBooking.status === "finished"}
                  >
                    <Clock className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ServiceTaskList;
