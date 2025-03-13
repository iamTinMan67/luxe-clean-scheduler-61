
import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Clock, Calendar, CheckCheck, Trash2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";

type TodoItem = {
  id: string;
  task: string;
  completed: boolean;
  booking?: string;
  customer?: string;
  estimatedTime?: number;  // in minutes
  timeSpent?: number;      // in minutes
  dateCreated: string;
  dueDate?: string;
};

const TodoList = () => {
  const [todos, setTodos] = useState<TodoItem[]>([
    {
      id: "1",
      task: "Complete exterior detailing for BMW X5",
      completed: false,
      booking: "BK-2023-001",
      customer: "James Wilson",
      estimatedTime: 120,
      timeSpent: 80,
      dateCreated: "2023-05-20",
      dueDate: "2023-05-20"
    },
    {
      id: "2",
      task: "Interior deep clean for Tesla Model 3",
      completed: false,
      booking: "BK-2023-002",
      customer: "Sarah Johnson",
      estimatedTime: 90,
      timeSpent: 45,
      dateCreated: "2023-05-20",
      dueDate: "2023-05-20"
    },
    {
      id: "3",
      task: "Ceramic coating application",
      completed: false,
      booking: "BK-2023-003",
      customer: "Michael Brown",
      estimatedTime: 180,
      timeSpent: 0,
      dateCreated: "2023-05-20",
      dueDate: "2023-05-21"
    },
    {
      id: "4",
      task: "Wheel restoration and tire dressing",
      completed: true,
      booking: "BK-2023-004",
      customer: "Emma Thompson",
      estimatedTime: 60,
      timeSpent: 60,
      dateCreated: "2023-05-19",
      dueDate: "2023-05-19"
    }
  ]);

  const [newTask, setNewTask] = useState("");

  const addTask = () => {
    if (!newTask.trim()) return;

    const task: TodoItem = {
      id: Date.now().toString(),
      task: newTask,
      completed: false,
      dateCreated: new Date().toISOString().split('T')[0],
    };

    setTodos([task, ...todos]);
    setNewTask("");
  };

  const toggleTask = (id: string) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTask = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const updateTimeSpent = (id: string, increment: number) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { 
        ...todo, 
        timeSpent: Math.min((todo.timeSpent || 0) + increment, todo.estimatedTime || 0)
      } : todo
    ));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="container mx-auto py-8 px-4"
    >
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Staff To-Do List</h1>
        <p className="text-gold">Track and manage daily tasks</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="bg-black/60 border-gold/30">
            <CardHeader>
              <CardTitle className="text-white">Today's Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 mb-6">
                <Input
                  placeholder="Add a new task..."
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addTask()}
                  className="bg-black/40 border-gold/30 text-white"
                />
                <Button 
                  onClick={addTask}
                  className="gold-gradient text-black hover:shadow-gold/20 hover:shadow-lg"
                >
                  <Plus size={16} className="mr-2" />
                  Add Task
                </Button>
              </div>

              <div className="space-y-4">
                {todos.map((todo) => (
                  <div
                    key={todo.id}
                    className={`p-4 rounded-lg border ${
                      todo.completed 
                        ? "bg-green-500/10 border-green-500/30" 
                        : "bg-black/40 border-gold/30"
                    } transition-colors duration-200`}
                  >
                    <div className="flex items-start gap-4">
                      <Checkbox
                        checked={todo.completed}
                        onCheckedChange={() => toggleTask(todo.id)}
                        className="mt-1"
                      />
                      
                      <div className="flex-grow">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p className={`font-medium ${
                              todo.completed ? "text-green-400 line-through" : "text-white"
                            }`}>
                              {todo.task}
                            </p>
                            
                            {(todo.booking || todo.customer) && (
                              <p className="text-white/60 text-sm mt-1">
                                {todo.booking && <span className="mr-2">{todo.booking}</span>}
                                {todo.customer && <span>{todo.customer}</span>}
                              </p>
                            )}
                          </div>
                          
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => deleteTask(todo.id)}
                            className="text-white/60 hover:text-red-400 hover:bg-red-500/20"
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                        
                        {todo.estimatedTime && (
                          <div className="mt-3 space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <div className="flex items-center text-white/60">
                                <Clock size={14} className="mr-1" />
                                <span>
                                  {todo.timeSpent || 0}/{todo.estimatedTime} minutes
                                </span>
                              </div>
                              
                              {!todo.completed && (
                                <div className="flex items-center gap-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => updateTimeSpent(todo.id, 5)}
                                    className="h-7 px-2 border-gold/30 text-white hover:bg-gold/20"
                                  >
                                    +5m
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => updateTimeSpent(todo.id, 15)}
                                    className="h-7 px-2 border-gold/30 text-white hover:bg-gold/20"
                                  >
                                    +15m
                                  </Button>
                                </div>
                              )}
                            </div>
                            
                            <Progress
                              value={(todo.timeSpent || 0) / todo.estimatedTime * 100}
                              className="h-2 bg-black/40"
                            />
                          </div>
                        )}
                        
                        {todo.dueDate && (
                          <div className="flex items-center mt-2 text-sm text-white/60">
                            <Calendar size={14} className="mr-1" />
                            <span>Due: {todo.dueDate}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                
                {todos.length === 0 && (
                  <div className="text-center py-8 text-white/60">
                    <CheckCheck size={32} className="mx-auto mb-2 opacity-50" />
                    <p>No tasks for today</p>
                    <p className="text-sm">Add a new task to get started</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-1">
          <Card className="bg-black/60 border-gold/30">
            <CardHeader>
              <CardTitle className="text-white">Task Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 rounded-md bg-black/40 border border-gold/20">
                <p className="text-white/70 text-sm mb-1">Total Tasks</p>
                <p className="text-white text-2xl font-bold">{todos.length}</p>
              </div>
              
              <div className="p-4 rounded-md bg-black/40 border border-gold/20">
                <p className="text-white/70 text-sm mb-1">Completed</p>
                <p className="text-green-500 text-2xl font-bold">
                  {todos.filter(todo => todo.completed).length}
                </p>
              </div>
              
              <div className="p-4 rounded-md bg-black/40 border border-gold/20">
                <p className="text-white/70 text-sm mb-1">Remaining</p>
                <p className="text-amber-500 text-2xl font-bold">
                  {todos.filter(todo => !todo.completed).length}
                </p>
              </div>
              
              <div className="p-4 rounded-md bg-black/40 border border-gold/20">
                <p className="text-white/70 text-sm mb-1">Progress</p>
                <Progress
                  value={todos.length > 0 ? (todos.filter(todo => todo.completed).length / todos.length) * 100 : 0}
                  className="h-2 mt-2 bg-black/40"
                />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-black/60 border-gold/30 mt-6">
            <CardHeader>
              <CardTitle className="text-white">Quick Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-2">
                  <span className="text-white/70">Tasks Created Today</span>
                  <span className="text-white font-medium">
                    {todos.filter(todo => todo.dateCreated === new Date().toISOString().split('T')[0]).length}
                  </span>
                </div>
                
                <div className="flex items-center justify-between p-2">
                  <span className="text-white/70">Overdue Tasks</span>
                  <span className="text-red-400 font-medium">
                    {todos.filter(todo => 
                      !todo.completed && 
                      todo.dueDate && 
                      new Date(todo.dueDate) < new Date()
                    ).length}
                  </span>
                </div>
                
                <div className="flex items-center justify-between p-2">
                  <span className="text-white/70">Completion Rate</span>
                  <span className="text-green-400 font-medium">
                    {todos.length > 0 
                      ? Math.round((todos.filter(todo => todo.completed).length / todos.length) * 100)
                      : 0}%
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  );
};

export default TodoList;
