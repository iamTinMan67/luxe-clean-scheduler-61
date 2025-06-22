
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Circle, Clock, Timer } from "lucide-react";
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

        {/* Progress bar */}
        <div className="mb-4">
          <div className="flex justify-between text-sm text-gray-400 mb-2">
            <span>Overall Progress</span>
            <span>{progressPercentage}% Complete</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-gold to-yellow-400 h-3 rounded-full transition-all duration-500 ease-out" 
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
          {remainingTasks.length > 0 && (
            <div className="flex items-center mt-2 text-sm text-gray-400">
              <Timer className="h-4 w-4 mr-1" />
              <span>Est. {formatTime(estimatedRemainingTime)} remaining</span>
            </div>
          )}
        </div>

        {tasks.length > 0 ? (
          <ul className="space-y-2">
            {tasks.map((task) => (
              <li key={task.id} className="flex items-center justify-between p-3 border border-gray-800 rounded-md bg-black/30">
                <div className="flex items-center">
                  {task.completed ? (
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  ) : (
                    <Circle className="h-5 w-5 text-gray-500 mr-3" />
                  )}
                  <div>
                    <span className={task.completed ? 'text-gray-400 line-through' : 'text-white'}>
                      {task.name}
                    </span>
                    {task.completed && task.actualTime && (
                      <div className="text-xs text-green-400 mt-1">
                        Completed in {task.actualTime} min
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
