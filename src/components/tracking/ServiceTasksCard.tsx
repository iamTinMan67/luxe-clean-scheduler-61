
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Circle, Clock } from "lucide-react";
import { ServiceTaskItem } from "@/types/task";

interface ServiceTasksCardProps {
  isInspected: boolean;
  tasks: ServiceTaskItem[];
}

const ServiceTasksCard = ({ isInspected, tasks }: ServiceTasksCardProps) => {
  return (
    <Card className="bg-black/60 border-gold/30">
      <CardHeader className="pb-2">
        <CardTitle className="text-white">Service Tasks</CardTitle>
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

        {tasks.length > 0 ? (
          <ul className="space-y-2">
            {tasks.map((task) => (
              <li key={task.id} className="flex items-center justify-between p-3 border border-gray-800 rounded-md bg-black/30">
                <div className="flex items-center">
                  {task.completed ? (
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  ) : (
                    <Circle className="h-5 w-5 text-gray-500 mr-2" />
                  )}
                  <span className={task.completed ? 'text-gray-400' : 'text-white'}>
                    {task.name}
                  </span>
                </div>
                <div className="flex items-center text-sm text-gray-400">
                  <Clock className="h-3.5 w-3.5 mr-1" />
                  <span>{task.allocatedTime} min</span>
                  {task.actualTime && (
                    <span className="ml-2 text-gold">
                      (actual: {task.actualTime} min)
                    </span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="py-8 text-center">
            <p className="text-gray-400">No tasks have been assigned yet.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ServiceTasksCard;
