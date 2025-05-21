
import { useState } from 'react';

// Define the TodoTask interface locally since it's not exported from @/types/task
export interface TodoTask {
  id: number;
  text: string;
  completed: boolean;
}

export const useTodoItems = () => {
  const [todos, setTodos] = useState<TodoTask[]>([
    { id: 1, text: 'Learn React', completed: false },
    { id: 2, text: 'Build a Todo App', completed: true },
    { id: 3, text: 'Deploy the App', completed: false },
  ]);
  
  const [newTodo, setNewTodo] = useState('');

  // Handle adding a regular todo
  const handleAddTodo = () => {
    if (newTodo.trim() !== '') {
      setTodos([...todos, { id: Date.now(), text: newTodo, completed: false }]);
      setNewTodo('');
    }
  };

  // Handle completing a regular todo
  const handleCompleteTodo = (id: number) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  // Handle deleting a regular todo
  const handleDeleteTodo = (id: number) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  return {
    todos,
    newTodo,
    setNewTodo,
    handleAddTodo,
    handleCompleteTodo,
    handleDeleteTodo
  };
};
