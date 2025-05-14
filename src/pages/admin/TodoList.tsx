
import { motion } from "framer-motion";
import { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { CheckCircle2, XCircle, AlertCircle, Clock } from 'lucide-react';

interface TodoItem {
  id: number;
  text: string;
  completed: boolean;
  jobId?: string;
  jobStatus?: string;
  inspectionComplete?: boolean;
}

interface Job {
  id: string;
  customer: string;
  vehicle: string;
  date: string;
  status: string;
  inspectionComplete: boolean;
  tasks: TodoItem[];
}

const TodoList = () => {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [newTodo, setNewTodo] = useState('');
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJob, setSelectedJob] = useState<string | null>(null);

  // Mock data for jobs
  useEffect(() => {
    // In a real app, this would come from an API or database
    const mockJobs: Job[] = [
      {
        id: 'job-1',
        customer: 'John Smith',
        vehicle: 'Audi A4',
        date: '2025-05-15',
        status: 'in-progress',
        inspectionComplete: true,
        tasks: [
          { id: 101, text: 'Exterior wash', completed: true, jobId: 'job-1' },
          { id: 102, text: 'Interior vacuum', completed: false, jobId: 'job-1' },
          { id: 103, text: 'Window cleaning', completed: false, jobId: 'job-1' },
          { id: 104, text: 'Tire dressing', completed: false, jobId: 'job-1' }
        ]
      },
      {
        id: 'job-2',
        customer: 'Sarah Johnson',
        vehicle: 'BMW X5',
        date: '2025-05-16',
        status: 'in-progress',
        inspectionComplete: true,
        tasks: [
          { id: 201, text: 'Full exterior detail', completed: true, jobId: 'job-2' },
          { id: 202, text: 'Leather treatment', completed: false, jobId: 'job-2' },
          { id: 203, text: 'Engine bay cleaning', completed: false, jobId: 'job-2' }
        ]
      },
      {
        id: 'job-3',
        customer: 'Michael Brown',
        vehicle: 'Tesla Model 3',
        date: '2025-05-17',
        status: 'confirmed',
        inspectionComplete: false,
        tasks: []
      },
      {
        id: 'job-4',
        customer: 'Emily Wilson',
        vehicle: 'Ford Ranger',
        date: '2025-05-14',
        status: 'pending',
        inspectionComplete: false,
        tasks: []
      }
    ];
    
    setJobs(mockJobs);
    
    // Filter for general todos (not associated with jobs)
    const generalTodos = [
      { id: 1, text: 'Order more cleaning supplies', completed: false },
      { id: 2, text: 'Schedule staff meeting', completed: true },
      { id: 3, text: 'Update website prices', completed: false },
    ];
    
    setTodos(generalTodos);
  }, []);

  const handleAddTodo = () => {
    if (newTodo.trim() !== '') {
      if (selectedJob) {
        // Add todo to specific job
        setJobs(jobs.map(job => {
          if (job.id === selectedJob) {
            return {
              ...job,
              tasks: [
                ...job.tasks,
                { id: Date.now(), text: newTodo, completed: false, jobId: selectedJob }
              ]
            };
          }
          return job;
        }));
      } else {
        // Add general todo
        setTodos([
          ...todos, 
          { id: Date.now(), text: newTodo, completed: false }
        ]);
      }
      setNewTodo('');
      toast({
        title: "Task added",
        description: "New task has been added to your list"
      });
    }
  };

  const handleCompleteTodo = (id: number) => {
    if (selectedJob) {
      setJobs(jobs.map(job => {
        if (job.id === selectedJob) {
          return {
            ...job,
            tasks: job.tasks.map(task => 
              task.id === id ? { ...task, completed: !task.completed } : task
            )
          };
        }
        return job;
      }));
    } else {
      setTodos(
        todos.map((todo) =>
          todo.id === id ? { ...todo, completed: !todo.completed } : todo
        )
      );
    }
  };

  const handleDeleteTodo = (id: number) => {
    if (selectedJob) {
      setJobs(jobs.map(job => {
        if (job.id === selectedJob) {
          return {
            ...job,
            tasks: job.tasks.filter(task => task.id !== id)
          };
        }
        return job;
      }));
    } else {
      setTodos(todos.filter((todo) => todo.id !== id));
    }
    
    toast({
      title: "Task removed",
      description: "Task has been deleted from your list",
      variant: "destructive"
    });
  };

  const eligibleJobs = jobs.filter(job => 
    job.status === 'in-progress' && job.inspectionComplete
  );

  const currentJobTasks = selectedJob 
    ? jobs.find(job => job.id === selectedJob)?.tasks || []
    : [];

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'completed':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'in-progress':
        return <Clock className="h-4 w-4 text-blue-500" />;
      case 'confirmed':
        return <AlertCircle className="h-4 w-4 text-orange-500" />;
      case 'pending':
      default:
        return <XCircle className="h-4 w-4 text-red-500" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container mx-auto py-12 px-4"
    >
      <h1 className="text-3xl font-bold text-white mb-6 text-center">To-Do List</h1>

      <Tabs defaultValue="jobs" className="w-full max-w-4xl mx-auto">
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="jobs">Job Tasks</TabsTrigger>
          <TabsTrigger value="general">General Tasks</TabsTrigger>
        </TabsList>
        
        <TabsContent value="jobs">
          <Card className="bg-black/60 border-gold/30">
            <CardContent className="p-6">
              <div className="mb-6">
                <label className="text-sm text-white/70 mb-2 block">Select Job:</label>
                <Select 
                  value={selectedJob || ""} 
                  onValueChange={setSelectedJob}
                >
                  <SelectTrigger className="bg-black/70 text-white border-gold/50 focus-visible:ring-gold/50">
                    <SelectValue placeholder="Select a job with completed inspection" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 border-gold/30 text-white">
                    {eligibleJobs.length > 0 ? (
                      eligibleJobs.map(job => (
                        <SelectItem key={job.id} value={job.id}>
                          <div className="flex items-center">
                            {getStatusIcon(job.status)}
                            <span className="ml-2">
                              {job.customer} - {job.vehicle} ({new Date(job.date).toLocaleDateString()})
                            </span>
                          </div>
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="none" disabled>
                        No eligible jobs found
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>

              {selectedJob ? (
                <>
                  <div className="flex items-center space-x-2 mb-4">
                    <Input
                      type="text"
                      placeholder="Add a new task for this job"
                      className="bg-black/70 text-white border-gold/50 focus-visible:ring-gold/50"
                      value={newTodo}
                      onChange={(e) => setNewTodo(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleAddTodo()}
                    />
                    <Button onClick={handleAddTodo} className="gold-gradient text-black">Add</Button>
                  </div>

                  {currentJobTasks.length > 0 ? (
                    <ul className="space-y-2">
                      {currentJobTasks.map((task) => (
                        <li key={task.id} className="flex items-center justify-between py-2 border-b border-gold/30">
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id={`task-${task.id}`}
                              checked={task.completed}
                              onCheckedChange={() => handleCompleteTodo(task.id)}
                              className="border-gold/50 data-[state=checked]:bg-gold data-[state=checked]:text-black"
                            />
                            <label
                              htmlFor={`task-${task.id}`}
                              className={`text-white ${task.completed ? 'line-through text-gray-400' : ''}`}
                            >
                              {task.text}
                            </label>
                          </div>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteTodo(task.id)}
                          >
                            Delete
                          </Button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-white/60 text-center py-4">No tasks yet for this job. Add some tasks above.</p>
                  )}
                </>
              ) : (
                <div className="text-center py-8 text-white/60">
                  <p className="mb-2">Please select a job to manage its tasks</p>
                  <p className="text-sm">Only jobs with completed pre-inspection reports and "In Progress" status are available</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="general">
          <Card className="bg-black/60 border-gold/30">
            <CardContent className="p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Input
                  type="text"
                  placeholder="Add a general task"
                  className="bg-black/70 text-white border-gold/50 focus-visible:ring-gold/50"
                  value={newTodo}
                  onChange={(e) => setNewTodo(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddTodo()}
                />
                <Button onClick={handleAddTodo} className="gold-gradient text-black">Add</Button>
              </div>

              <ul className="space-y-2">
                {todos.map((todo) => (
                  <li key={todo.id} className="flex items-center justify-between py-2 border-b border-gold/30">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={`todo-${todo.id}`}
                        checked={todo.completed}
                        onCheckedChange={() => handleCompleteTodo(todo.id)}
                        className="border-gold/50 data-[state=checked]:bg-gold data-[state=checked]:text-black"
                      />
                      <label
                        htmlFor={`todo-${todo.id}`}
                        className={`text-white ${todo.completed ? 'line-through text-gray-400' : ''}`}
                      >
                        {todo.text}
                      </label>
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteTodo(todo.id)}
                    >
                      Delete
                    </Button>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};

export default TodoList;
