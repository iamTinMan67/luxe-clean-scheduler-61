
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Circle, Clock, Timer, Eye, AlertCircle } from "lucide-react";
import { ServiceTaskItem } from "@/types/task";

interface ServiceTasksCardProps {
  isInspected: boolean;
  tasks: ServiceTaskItem[];
}

const ServiceTasksCard = ({ isInspected, tasks }: ServiceTasksCardProps) => {
  // Calculate progress metrics
  const completedTasks = tasks.filter(task => task.completed).length;
  const totalTasks = tasks.length;
  const progressPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  
  // Calculate time estimates
  const remainingTasks = tasks.filter(task => !task.completed);
  const estimatedRemainingTime = remainingTasks.reduce((total, task) => total + task.allocatedTime, 0);
  
  // Check if these are placeholder tasks (for inspecting status)
  const isPlaceholderTasks = tasks.length > 0 && tasks.every(task => task.id.startsWith('placeholder-'));
  
  const formatTime = (minutes: number) => {
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  return (
    <Card className="bg-black/60 border-gold/30">
      <CardHeader className="pb-2">
        <CardTitle className="text-white flex items-center justify-between">
          <span>Service Tasks</span>
          <div className="text-sm text-gray-400">
            {completedTasks}/{totalTasks} ({progressPercentage}%)
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isInspected && (
          <div className="mb-4 p-3 border border-gold/30 rounded-md bg-gold/10">
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-gold mr-2" />
              <span className="text-gold font-medium">Inspection Completed</span>
            </div>
          </div>
        )}

        {/* Show inspection in progress for placeholder tasks */}
        {isPlaceholderTasks && (
          <div className="mb-4 p-3 border border-blue/30 rounded-md bg-blue/10">
            <div className="flex items-center">
              <Eye className="h-5 w-5 text-blue-400 mr-2" />
              <span className="text-blue-400 font-medium">Inspection in Progress</span>
            </div>
            <p className="text-sm text-blue-300 mt-1">
              Our team is currently inspecting your vehicle. Detailed tasks will appear once the inspection is complete.
            </p>
          </div>
        )}

        {/* Enhanced progress bar with better visual indicators */}
        <div className="mb-4">
          <div className="flex justify-between text-sm text-gray-400 mb-2">
            <span>Overall Progress</span>
            <span className="font-medium">{progressPercentage}% Complete</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-4 relative overflow-hidden">
            <div 
              className="bg-gradient-to-r from-gold via-yellow-400 to-gold h-4 rounded-full transition-all duration-700 ease-out relative" 
              style={{ width: `${progressPercentage}%` }}
            >
              {/* Animated shimmer effect for active progress */}
              {progressPercentage > 0 && progressPercentage < 100 && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
              )}
            </div>
          </div>
          
          {/* Enhanced time display */}
          {remainingTasks.length > 0 && !isPlaceholderTasks && (
            <div className="flex items-center justify-between mt-2 text-sm">
              <div className="flex items-center text-gray-400">
                <Timer className="h-4 w-4 mr-1" />
                <span>Est. {formatTime(estimatedRemainingTime)} remaining</span>
              </div>
              {progressPercentage > 0 && (
                <div className="flex items-center text-green-400">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  <span>{completedTasks} task{completedTasks !== 1 ? 's' : ''} completed</span>
                </div>
              )}
            </div>
          )}
          
          {/* Progress status messages */}
          {progressPercentage === 100 && (
            <div className="mt-2 text-center">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-green-900/40 text-green-400 text-sm font-medium">
                <CheckCircle className="h-4 w-4 mr-1" />
                Service Complete!
              </div>
            </div>
          )}
        </div>

        {tasks.length > 0 ? (
          <ul className="space-y-2">
            {tasks.map((task) => (
              <li key={task.id} className={`flex items-center justify-between p-3 border rounded-md transition-colors ${
                task.completed 
                  ? 'border-green-800 bg-green-900/20' 
                  : isPlaceholderTasks 
                    ? 'border-blue-800 bg-blue-900/20'
                    : 'border-gray-800 bg-black/30'
              }`}>
                <div className="flex items-center">
                  {task.completed ? (
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  ) : isPlaceholderTasks ? (
                    <AlertCircle className="h-5 w-5 text-blue-400 mr-3" />
                  ) : (
                    <Circle className="h-5 w-5 text-gray-500 mr-3" />
                  )}
                  <div>
                    <span className={`${
                      task.completed 
                        ? 'text-gray-400 line-through' 
                        : isPlaceholderTasks
                          ? 'text-blue-300'
                          : 'text-white'
                    }`}>
                      {task.name}
                    </span>
                    {task.completed && task.actualTime && (
                      <div className="text-xs text-green-400 mt-1">
                        Completed in {task.actualTime} min
                      </div>
                    )}
                    {isPlaceholderTasks && (
                      <div className="text-xs text-blue-400 mt-1">
                        Estimated task - details will be updated after inspection
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center text-sm text-gray-400">
                  <Clock className="h-3.5 w-3.5 mr-1" />
                  <span>{task.allocatedTime} min</span>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="py-8 text-center">
            <p className="text-gray-400">No tasks have been assigned yet.</p>
            <p className="text-sm text-gray-500 mt-1">Tasks will appear here once the service begins.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ServiceTasksCard;
