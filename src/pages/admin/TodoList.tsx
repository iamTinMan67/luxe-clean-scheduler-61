import { motion } from "framer-motion";
import { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

interface TodoItem {
  id: number;
  text: string;
  completed: boolean;
}

const TodoList = () => {
  const [todos, setTodos] = useState<TodoItem[]>([
    { id: 1, text: 'Learn React', completed: false },
    { id: 2, text: 'Build a Todo App', completed: true },
    { id: 3, text: 'Deploy the App', completed: false },
  ]);
  const [newTodo, setNewTodo] = useState('');

  const handleAddTodo = () => {
    if (newTodo.trim() !== '') {
      setTodos([...todos, { id: Date.now(), text: newTodo, completed: false }]);
      setNewTodo('');
    }
  };

  const handleCompleteTodo = (id: number) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const handleDeleteTodo = (id: number) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container mx-auto py-12 px-4"
    >
      <h1 className="text-3xl font-bold text-white mb-6">To-Do List</h1>

      <Card className="bg-black/60 border-gold/30">
        <CardContent className="p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Input
              type="text"
              placeholder="Add a new task"
              className="bg-black/70 text-white border-gold/50 focus-visible:ring-gold/50"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
            />
            <Button onClick={handleAddTodo} className="gold-gradient text-black">Add</Button>
          </div>

          <ul>
            {todos.map((todo) => (
              <li key={todo.id} className="flex items-center justify-between py-2 border-b border-gold/30">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={`todo-${todo.id}`}
                    checked={todo.completed}
                    onCheckedChange={() => handleCompleteTodo(todo.id)}
                    className="ring-gold/50 focus-visible:ring-gold/50"
                  />
                  <label
                    htmlFor={`todo-${todo.id}`}
                    className={`text-white ${todo.completed ? 'line-through text-gray-400' : ''
                      }`}
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
    </motion.div>
  );
};

export default TodoList;

